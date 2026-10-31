import { render, screen, within } from "@testing-library/react";
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

describe("ADM-12 — formulário de criação de usuário", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv("NEXT_PUBLIC_API_URL", apiBase);

    fetchMock = vi.fn(async (url: string) => {
      if (url === `${apiBase}/auth/me`) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            userId: "00000000-0000-4000-8000-000000000001",
            role: "ADMINISTRATOR",
          }),
        };
      }

      if (url === `${apiBase}/admin/users`) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ users: [] }),
        };
      }

      throw new Error("Requisição inesperada no teste.");
    });

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  async function openCreationForm() {
    const user = userEvent.setup();

    render(<AdminUsersPage />);

    const button = await screen.findByRole("button", {
      name: "Adicionar usuário",
    });

    expect(button).toBeEnabled();

    await user.click(button);

    const form = screen.getByRole("form", {
      name: "Novo usuário",
    });

    return { user, form };
  }

  it("abre o formulário dentro da área de administração", async () => {
    const { form } = await openCreationForm();

    const administration = screen.getByRole("region", {
      name: "Administração de usuários",
    });

    expect(administration).toContainElement(form);

    expect(
      within(form).getByRole("textbox", {
        name: "Nome",
      }),
    ).toBeInTheDocument();

    expect(
      within(form).getByRole("textbox", {
        name: "E-mail",
      }),
    ).toBeInTheDocument();

    expect(
      within(form).getByLabelText("Senha inicial"),
    ).toBeInTheDocument();

    expect(
      within(form).getByRole("combobox", {
        name: "Perfil",
      }),
    ).toBeInTheDocument();

    expect(
      within(form).getByRole("button", {
        name: "Criar usuário",
      }),
    ).toBeInTheDocument();

    expect(
      within(form).getByRole("button", {
        name: "Cancelar",
      }),
    ).toBeInTheDocument();
  });

  it("utiliza campos obrigatórios e senha mascarada", async () => {
    const { form } = await openCreationForm();

    const name = within(form).getByRole("textbox", {
      name: "Nome",
    });

    const email = within(form).getByRole("textbox", {
      name: "E-mail",
    });

    const password = within(form).getByLabelText(
      "Senha inicial",
    );

    expect(name).toBeRequired();

    expect(email).toBeRequired();
    expect(email).toHaveAttribute("type", "email");

    expect(password).toBeRequired();
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveAttribute("minlength", "12");
  });

  it("permite selecionar os dois perfis autorizados", async () => {
    const { form, user } = await openCreationForm();

    const role = within(form).getByRole("combobox", {
      name: "Perfil",
    });

    expect(role).toHaveTextContent("Operador");

    await user.click(role);

    const listbox = within(form).getByRole("listbox", {
      name: "Perfil",
    });

    expect(
      within(listbox).getAllByRole("option"),
    ).toHaveLength(2);

    expect(
      within(listbox).getByRole("option", {
        name: "Operador",
      }),
    ).toBeInTheDocument();

    expect(
      within(listbox).getByRole("option", {
        name: "Administrador",
      }),
    ).toBeInTheDocument();
  });

  it("cancela o cadastro sem enviar dados à API", async () => {
    const { user, form } = await openCreationForm();

    await user.type(
      within(form).getByRole("textbox", { name: "Nome" }),
      "Usuário Fictício",
    );

    await user.click(
      within(form).getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(
      screen.queryByRole("form", {
        name: "Novo usuário",
      }),
    ).not.toBeInTheDocument();

    const postRequests = fetchMock.mock.calls.filter(
      ([, options]) => options?.method === "POST",
    );

    expect(postRequests).toHaveLength(0);

    expect(
      screen.getByRole("button", {
        name: "Adicionar usuário",
      }),
    ).toBeEnabled();
  });
});
