import { render, screen, waitFor, within } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import AdminSettingsPage, { metadata } from "./page";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("ADM-11 — rota de Configurações", () => {
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

  function session(role: "ADMINISTRATOR" | "OPERATOR") {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ userId, role }),
      }),
    );
  }

  it("nao permite indexacao da rota", () => {
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("permite Configurações ao Administrador", async () => {
    session("ADMINISTRATOR");
    render(<AdminSettingsPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Configurações",
      }),
    ).toBeInTheDocument();

    for (const name of [
      "Segurança da conta",
      "Usuários e permissões",
    ]) {
      expect(
        screen.getByRole("heading", { name }),
      ).toBeInTheDocument();
    }

    const nav = screen.getByRole("navigation", {
      name: "Navegação administrativa",
    });

    expect(
      within(nav).getByRole("link", {
        name: "Configurações",
      }),
    ).toHaveAttribute("aria-current", "page");

    expect(
      within(nav).getByRole("link", {
        name: "Painel",
      }),
    ).not.toHaveAttribute("aria-current");
  });

  it("nega Configurações ao Operador", async () => {
    session("OPERATOR");
    render(<AdminSettingsPage />);

    expect(
      await screen.findByText("Acesso negado"),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Configurações",
      }),
    ).not.toBeInTheDocument();
  });

  it("redireciona sessao inexistente para login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    );

    render(<AdminSettingsPage />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/admin/login");
    });

    expect(
      screen.queryByRole("heading", {
        name: "Configurações",
      }),
    ).not.toBeInTheDocument();
  });
});
