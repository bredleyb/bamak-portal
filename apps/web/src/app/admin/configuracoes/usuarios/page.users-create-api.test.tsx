import {
  render,
  screen,
  waitFor,
  within,
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

type PostMode =
  | "success"
  | "conflict"
  | "forbidden"
  | "expired"
  | "server"
  | "network"
  | "pending";

type MockResponse = {
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

function response(
  status: number,
  payload: unknown,
): MockResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}

describe("ADM-12 — integração de criação de usuários", () => {
  let postMode: PostMode;
  let created: boolean;
  let fetchMock: ReturnType<typeof vi.fn>;
  let resolvePending:
    | ((value: MockResponse) => void)
    | null;

  function postCalls() {
    return fetchMock.mock.calls.filter(
      ([url, options]) =>
        url === `${apiBase}/admin/users` &&
        options?.method === "POST",
    );
  }

  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv("NEXT_PUBLIC_API_URL", apiBase);

    postMode = "success";
    created = false;
    resolvePending = null;

    fetchMock = vi.fn(
      async (
        url: string,
        options?: RequestInit,
      ): Promise<MockResponse> => {
        if (url === `${apiBase}/auth/me`) {
          return response(200, {
            userId: "00000000-0000-4000-8000-000000000001",
            role: "ADMINISTRATOR",
          });
        }

        if (url === `${apiBase}/admin/users`) {
          if (options?.method === "POST") {
            if (postMode === "network") {
              throw new Error(
                "Diagnóstico interno fictício de rede",
              );
            }

            if (postMode === "pending") {
              return new Promise<MockResponse>((resolve) => {
                resolvePending = resolve;
              });
            }

            if (postMode === "conflict") {
              return response(409, {
                statusCode: 409,
                message:
                  "Ja existe uma conta com os dados informados.",
              });
            }

            if (postMode === "forbidden") {
              return response(403, {
                statusCode: 403,
                message: "Forbidden",
              });
            }

            if (postMode === "expired") {
              return response(401, {
                statusCode: 401,
                message: "Unauthorized",
              });
            }

            if (postMode === "server") {
              return response(500, {
                statusCode: 500,
                message: "Diagnóstico interno fictício",
              });
            }

            created = true;
            return response(201, { user: createdUser });
          }

          return response(200, {
            users: created ? [createdUser] : [],
          });
        }

        throw new Error("Requisição inesperada no teste.");
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

  async function fillValid(
    user: ReturnType<typeof userEvent.setup>,
    form: HTMLElement,
  ) {
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
  }

  async function submitValid() {
    const { user, form } = await openForm();

    await fillValid(user, form);

    await user.click(
      within(form).getByRole("button", {
        name: "Criar usuário",
      }),
    );

    return { user, form };
  }

  it("envia os dados com sessão e atualiza a listagem", async () => {
    const { user, form } = await openForm();

    await fillValid(user, form);

    const submit = within(form).getByRole("button", {
      name: "Criar usuário",
    });

    expect(submit).toBeEnabled();

    await user.click(submit);

    await waitFor(() => {
      expect(postCalls()).toHaveLength(1);
    });

    const [, options] = postCalls()[0];

    expect(options).toMatchObject({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(JSON.parse(String(options?.body))).toEqual({
      name: createdUser.name,
      email: createdUser.email,
      password: "SenhaExemplo!2026",
      role: "OPERATOR",
    });

    expect(
      await screen.findByText(createdUser.name),
    ).toBeInTheDocument();

    expect(
      screen.getByText(createdUser.email),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("form", {
        name: "Novo usuário",
      }),
    ).not.toBeInTheDocument();
  });

  it("envia o perfil Administrador quando selecionado", async () => {
    const { user, form } = await openForm();

    await fillValid(user, form);

    await user.click(
      within(form).getByRole("combobox", {
        name: "Perfil",
      }),
    );

    await user.click(
      screen.getByRole("option", {
        name: "Administrador",
      }),
    );

    await user.click(
      within(form).getByRole("button", {
        name: "Criar usuário",
      }),
    );

    await waitFor(() => {
      expect(postCalls()).toHaveLength(1);
    });

    const [, options] = postCalls()[0];
    const body = JSON.parse(String(options?.body));

    expect(body.role).toBe("ADMINISTRATOR");
  });

  it("valida campos inválidos sem enviar à API", async () => {
    const { user, form } = await openForm();

    await user.type(
      within(form).getByRole("textbox", {
        name: "E-mail",
      }),
      "email-invalido",
    );

    await user.type(
      within(form).getByLabelText("Senha inicial"),
      "curta",
    );

    await user.click(
      within(form).getByRole("button", {
        name: "Criar usuário",
      }),
    );

    expect(
      within(form).getByText("Informe o nome."),
    ).toBeInTheDocument();

    expect(
      within(form).getByText("Informe um e-mail válido."),
    ).toBeInTheDocument();

    expect(
      within(form).getByText(
        "A senha deve ter pelo menos 12 caracteres.",
      ),
    ).toBeInTheDocument();

    expect(postCalls()).toHaveLength(0);
  });

  it("trata e-mail duplicado sem expor mensagem interna", async () => {
    postMode = "conflict";

    await submitValid();

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Este e-mail já está cadastrado.");

    expect(
      screen.queryByText(
        "Ja existe uma conta com os dados informados.",
      ),
    ).not.toBeInTheDocument();

    expect(postCalls()).toHaveLength(1);
  });

  it("trata ausência de permissão para criar usuários", async () => {
    postMode = "forbidden";

    await submitValid();

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Você não tem permissão para criar usuários.",
    );

    expect(postCalls()).toHaveLength(1);
  });

  it("redireciona ao login quando a sessão expira", async () => {
    postMode = "expired";

    await submitValid();

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/admin/login");
    });

    expect(postCalls()).toHaveLength(1);
  });

  it("mostra erro seguro diante de falha do servidor", async () => {
    postMode = "server";

    await submitValid();

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Não foi possível criar o usuário. Tente novamente.",
    );

    expect(
      screen.queryByText("Diagnóstico interno fictício"),
    ).not.toBeInTheDocument();
  });

  it("trata falha de conexão sem expor detalhes", async () => {
    postMode = "network";

    await submitValid();

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Não foi possível criar o usuário. Tente novamente.",
    );

    expect(
      screen.queryByText(
        "Diagnóstico interno fictício de rede",
      ),
    ).not.toBeInTheDocument();
  });

  it("impede requisições simultâneas", async () => {
    postMode = "pending";

    const { user, form } = await openForm();

    await fillValid(user, form);

    const submit = within(form).getByRole("button", {
      name: "Criar usuário",
    });

    await user.click(submit);

    await waitFor(() => {
      expect(postCalls()).toHaveLength(1);
    });

    expect(submit).toBeDisabled();

    await user.click(submit);

    expect(postCalls()).toHaveLength(1);

    created = true;

    if (!resolvePending) {
      throw new Error("Requisição pendente não registrada.");
    }

    resolvePending(response(201, {
      user: createdUser,
    }));

    expect(
      await screen.findByText(createdUser.name),
    ).toBeInTheDocument();

    expect(postCalls()).toHaveLength(1);
  });
});
