import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import AdminPage from "./page";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("ADM-11 — navegação para Configurações", () => {
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

  function authenticate(
    role: "ADMINISTRATOR" | "OPERATOR",
  ) {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ userId, role }),
      }),
    );
  }

  it("oferece Configurações como link ao Administrador", async () => {
    authenticate("ADMINISTRATOR");

    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    const nav = screen.getByRole("navigation", {
      name: "Navegação administrativa",
    });

    expect(
      within(nav).getByRole("link", {
        name: "Configurações",
      }),
    ).toHaveAttribute(
      "href",
      "/admin/configuracoes",
    );
  });

  it("oferece Configurações na gaveta do Administrador", async () => {
    authenticate("ADMINISTRATOR");

    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir menu administrativo",
      }),
    );

    const drawer = screen.getByRole("dialog", {
      name: "Menu administrativo",
    });

    const nav = within(drawer).getByRole(
      "navigation",
      { name: "Navegação do menu administrativo" },
    );

    expect(
      within(nav).getByRole("link", {
        name: "Configurações",
      }),
    ).toHaveAttribute(
      "href",
      "/admin/configuracoes",
    );
  });

  it("nao oferece Configurações ao Operador", async () => {
    authenticate("OPERATOR");

    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    const nav = screen.getByRole("navigation", {
      name: "Navegação administrativa",
    });

    expect(
      within(nav).queryByText("Configurações"),
    ).not.toBeInTheDocument();
  });
});