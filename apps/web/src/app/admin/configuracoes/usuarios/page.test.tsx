import { render, screen, waitFor, within } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import AdminUsersPage, { metadata } from "./page";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("ADM-12 — rota de Usuários e acessos", () => {
  const userId = "00000000-0000-4000-8000-000000000001";

  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv(
      "NEXT_PUBLIC_API_URL",
      "http://localhost:3001/api",
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  function authenticate(role: "ADMINISTRATOR" | "OPERATOR") {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ userId, role }),
      }),
    );
  }

  it("impede indexação da rota", () => {
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("exibe a estrutura ao Administrador", async () => {
    authenticate("ADMINISTRATOR");
    render(<AdminUsersPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Usuários e acessos",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Perfis e responsabilidades",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Acessos cadastrados",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Adicionar usuário",
      }),
    ).toBeEnabled();

    const nav = screen.getByRole("navigation", {
      name: "Navegação administrativa",
    });

    expect(
      within(nav).getByRole("link", {
        name: "Configurações",
      }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("nega a rota ao Operador", async () => {
    authenticate("OPERATOR");
    render(<AdminUsersPage />);

    expect(
      await screen.findByText("Acesso negado"),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Usuários e acessos",
      }),
    ).not.toBeInTheDocument();
  });

  it("redireciona sessão inválida ao login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    );

    render(<AdminUsersPage />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/admin/login");
    });

    expect(
      screen.queryByRole("heading", {
        name: "Usuários e acessos",
      }),
    ).not.toBeInTheDocument();
  });
});
