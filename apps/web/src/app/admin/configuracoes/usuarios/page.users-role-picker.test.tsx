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

describe("ADM-12 — seletor acessível de perfil", () => {
  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv("NEXT_PUBLIC_API_URL", apiBase);

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
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

        throw new Error("Requisição inesperada.");
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  async function setup() {
    const user = userEvent.setup();

    render(<AdminUsersPage />);

    await user.click(
      await screen.findByRole("button", {
        name: "Adicionar usuário",
      }),
    );

    const form = screen.getByRole("form", {
      name: "Novo usuário",
    });

    const picker = within(form).getByRole("combobox", {
      name: "Perfil",
    });

    return { user, form, picker };
  }

  it("usa um controle expansível, identificado como Perfil", async () => {
    const { picker } = await setup();

    expect(picker.tagName).toBe("BUTTON");
    expect(picker).toHaveAttribute("aria-haspopup", "listbox");
    expect(picker).toHaveAttribute("aria-expanded", "false");
    expect(picker).toHaveTextContent("Operador");
  });

  it("abre uma lista própria com os dois perfis", async () => {
    const { user, picker } = await setup();

    await user.click(picker);

    expect(picker).toHaveAttribute("aria-expanded", "true");

    const options = screen.getByRole("listbox", {
      name: "Perfil",
    });

    expect(
      within(options).getAllByRole("option"),
    ).toHaveLength(2);

    expect(
      within(options).getByRole("option", {
        name: "Operador",
      }),
    ).toHaveAttribute("aria-selected", "true");

    expect(
      within(options).getByRole("option", {
        name: "Administrador",
      }),
    ).toHaveAttribute("aria-selected", "false");
  });

  it("seleciona Administrador e preserva o valor para o formulário", async () => {
    const { user, form, picker } = await setup();

    await user.click(picker);

    await user.click(
      screen.getByRole("option", {
        name: "Administrador",
      }),
    );

    expect(picker).toHaveTextContent("Administrador");
    expect(picker).toHaveAttribute("aria-expanded", "false");

    const hidden = form.querySelector(
      'input[type="hidden"][name="role"]',
    );

    expect(hidden).toHaveValue("ADMINISTRATOR");
    expect(form.querySelector("select")).toBeNull();
  });

  it("opera por teclado e fecha com Escape", async () => {
    const { user, picker } = await setup();

    picker.focus();

    await user.keyboard("{ArrowDown}");

    expect(picker).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{ArrowDown}{Enter}");

    expect(picker).toHaveTextContent("Administrador");
    expect(picker).toHaveAttribute("aria-expanded", "false");
    expect(picker).toHaveFocus();

    await user.keyboard("{ArrowDown}{Escape}");

    expect(picker).toHaveAttribute("aria-expanded", "false");
    expect(picker).toHaveFocus();
  });

  it("fecha com clique externo e preserva a escolha atual", async () => {
    const { user, picker } = await setup();

    await user.click(picker);

    expect(
      screen.getByRole("listbox", { name: "Perfil" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("heading", {
        name: "Novo usuário",
      }),
    );

    expect(
      screen.queryByRole("listbox", { name: "Perfil" }),
    ).not.toBeInTheDocument();

    expect(picker).toHaveTextContent("Operador");
  });
});
