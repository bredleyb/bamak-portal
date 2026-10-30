import {
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import AdminUsersPage from "./page";

const replace = vi.hoisted(() => vi.fn());
const apiBase = "http://localhost:3001/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

type ApiReply = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

const createdUser = {
  id: "00000000-0000-4000-8000-000000000002",
  name: "Usuário de Exemplo",
  email: "novo@example.test",
  role: "OPERATOR",
  isActive: true,
  createdAt: "2026-10-30T13:00:00.000Z",
  updatedAt: "2026-10-30T13:00:00.000Z",
};

function reply(status: number, payload: unknown): ApiReply {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}

describe("ADM-12 — auditoria de resposta e acessibilidade", () => {
  let postResponse: () => Promise<ApiReply>;
  let fetchMock: ReturnType<typeof vi.fn>;

  function postCalls() {
    return fetchMock.mock.calls.filter(
      ([url, options]) =>
        url === `${apiBase}/admin/users` &&
        options?.method === "POST",
    );
  }

  function listCalls() {
    return fetchMock.mock.calls.filter(
      ([url, options]) =>
        url === `${apiBase}/admin/users` &&
        options?.method === "GET",
    );
  }

  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv("NEXT_PUBLIC_API_URL", apiBase);

    postResponse = async () =>
      reply(201, { user: createdUser });

    fetchMock = vi.fn(
      async (
        url: string,
        options?: RequestInit,
      ): Promise<ApiReply> => {
        if (url === `${apiBase}/auth/me`) {
          return reply(200, {
            userId: "00000000-0000-4000-8000-000000000001",
            role: "ADMINISTRATOR",
          });
        }

        if (url === `${apiBase}/admin/users`) {
          if (options?.method === "POST") {
            return postResponse();
          }

          if (options?.method === "GET") {
            return reply(200, { users: [] });
          }
        }

        throw new Error("Requisição inesperada.");
      },
    );

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  async function openForm() {
    const user = userEvent.setup();

    render(<AdminUsersPage />);

    await screen.findByText("Nenhum acesso cadastrado.");

    await user.click(
      screen.getByRole("button", {
        name: "Adicionar usuário",
      }),
    );

    const form = screen.getByRole("form", {
      name: "Novo usuário",
    });

    return { user, form };
  }

  async function submitValid() {
    const { user, form } = await openForm();

    await user.type(
      within(form).getByRole("textbox", {
        name: "Nome",
      }),
      createdUser.name,
    );

    await user.type(
      within(form).getByRole("textbox", {
        name: "E-mail",
      }),
      createdUser.email,
    );

    await user.type(
      within(form).getByLabelText("Senha inicial"),
      "SenhaExemplo!2026",
    );

    await user.click(
      within(form).getByRole("button", {
        name: "Criar usuário",
      }),
    );

    await waitFor(() => {
      expect(postCalls()).toHaveLength(1);
    });

    return form;
  }

  async function expectRejectedResponse() {
    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Não foi possível criar o usuário. Tente novamente.",
    );

    expect(
      screen.getByRole("form", {
        name: "Novo usuário",
      }),
    ).toBeInTheDocument();

    expect(listCalls()).toHaveLength(1);

    expect(
      screen.queryByText(createdUser.name),
    ).not.toBeInTheDocument();
  }

  it("rejeita HTTP 201 sem objeto de usuário", async () => {
    postResponse = async () => reply(201, {});

    await submitValid();

    await expectRejectedResponse();
  });

  it("rejeita perfil desconhecido na resposta", async () => {
    postResponse = async () =>
      reply(201, {
        user: {
          ...createdUser,
          role: "SUPERUSER",
        },
      });

    await submitValid();

    await expectRejectedResponse();
  });

  it("rejeita uma conta diferente da solicitada", async () => {
    postResponse = async () =>
      reply(201, {
        user: {
          ...createdUser,
          email: "outra-conta@example.test",
        },
      });

    await submitValid();

    await expectRejectedResponse();
  });

  it("trata JSON inválido após HTTP 201", async () => {
    postResponse = async () => ({
      ok: true,
      status: 201,
      json: async () => {
        throw new Error("Diagnóstico interno fictício");
      },
    });

    await submitValid();

    await expectRejectedResponse();

    expect(
      screen.queryByText("Diagnóstico interno fictício"),
    ).not.toBeInTheDocument();
  });

  it("leva o foco ao primeiro campo inválido", async () => {
    const { user, form } = await openForm();

    const name = within(form).getByRole("textbox", {
      name: "Nome",
    });

    await user.click(
      within(form).getByRole("button", {
        name: "Criar usuário",
      }),
    );

    expect(
      within(form).getByText("Informe o nome."),
    ).toBeInTheDocument();

    expect(name).toHaveFocus();

    expect(postCalls()).toHaveLength(0);
  });
});
