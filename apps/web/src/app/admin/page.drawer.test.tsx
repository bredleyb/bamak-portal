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
import AdminPage from "./page";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("ADM-02 — gaveta administrativa e logout", () => {
  const base = "http://localhost:3001/api";
  const userId = "00000000-0000-4000-8000-000000000001";

  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv("NEXT_PUBLIC_API_URL", base);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  function mockAuthenticated(
    role: "ADMINISTRATOR" | "OPERATOR",
  ) {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ userId, role }),
    });

    vi.stubGlobal("fetch", fetchMock);

    return fetchMock;
  }

  async function openDrawer() {
    const user = userEvent.setup();

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    const trigger = screen.getByRole("button", {
      name: "Abrir menu administrativo",
    });

    await user.click(trigger);

    const drawer = screen.getByRole("dialog", {
      name: "Menu administrativo",
    });

    return { user, trigger, drawer };
  }

  it("abre a gaveta modal do administrador conforme o Figma", async () => {
    mockAuthenticated("ADMINISTRATOR");
    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    expect(
      screen.queryByRole("dialog", {
        name: "Menu administrativo",
      }),
    ).not.toBeInTheDocument();

    const { drawer } = await openDrawer();

    expect(drawer).toHaveAttribute("aria-modal", "true");

    expect(
      within(drawer).getByText("ÁREA ADMINISTRATIVA"),
    ).toBeInTheDocument();

    expect(
      within(drawer).getByText("PERFIL"),
    ).toBeInTheDocument();

    expect(
      within(drawer).getByText("Administrador"),
    ).toBeInTheDocument();

    const navigation = within(drawer).getByRole(
      "navigation",
      { name: "Navegação do menu administrativo" },
    );

    for (const label of [
      "Painel",
      "Atendimentos",
      "Comunicação",
      "Configurações",
    ]) {
      expect(
        within(navigation).getByText(label),
      ).toBeInTheDocument();
    }

    expect(
      within(drawer).getByRole("button", {
        name: "Sair da conta",
      }),
    ).toBeInTheDocument();
  });

  it("restringe a gaveta do operador conforme o Figma", async () => {
    mockAuthenticated("OPERATOR");
    render(<AdminPage />);

    const { drawer } = await openDrawer();

    expect(
      within(drawer).getByText("Operador"),
    ).toBeInTheDocument();

    const navigation = within(drawer).getByRole(
      "navigation",
      { name: "Navegação do menu administrativo" },
    );

    expect(
      within(navigation).getByText("Painel"),
    ).toBeInTheDocument();

    expect(
      within(navigation).getByText("Atendimentos"),
    ).toBeInTheDocument();

    expect(
      within(navigation).queryByText("Comunicação"),
    ).not.toBeInTheDocument();

    expect(
      within(navigation).queryByText("Configurações"),
    ).not.toBeInTheDocument();

    expect(
      within(drawer).getByRole("button", {
        name: "Sair da conta",
      }),
    ).toBeInTheDocument();
  });

  it("fecha com Escape e devolve foco ao acionador", async () => {
    mockAuthenticated("ADMINISTRATOR");
    render(<AdminPage />);

    const { user, trigger } = await openDrawer();

    expect(
      screen.getByRole("dialog", {
        name: "Menu administrativo",
      }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", {
        name: "Menu administrativo",
      }),
    ).not.toBeInTheDocument();

    expect(trigger).toHaveFocus();
  });

  it("fecha ao selecionar a sobreposicao", async () => {
    mockAuthenticated("ADMINISTRATOR");
    render(<AdminPage />);

    const { user } = await openDrawer();

    await user.click(
      screen.getByRole("button", {
        name: "Fechar menu administrativo",
      }),
    );

    expect(
      screen.queryByRole("dialog", {
        name: "Menu administrativo",
      }),
    ).not.toBeInTheDocument();
  });

  it("revoga a sessao antes de redirecionar ao login", async () => {
    const fetchMock = vi.fn(async (resource: string) => {
      if (resource === `${base}/auth/me`) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            userId,
            role: "ADMINISTRATOR",
          }),
        };
      }

      if (resource === `${base}/auth/logout`) {
        return {
          ok: true,
          status: 204,
        };
      }

      throw new Error("Requisicao inesperada.");
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<AdminPage />);

    const { user, drawer } = await openDrawer();

    await user.click(
      within(drawer).getByRole("button", {
        name: "Sair da conta",
      }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `${base}/auth/logout`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
    });

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(
        "/admin/login",
      );
    });
  });

  it("informa falha de logout sem redirecionar", async () => {
    const fetchMock = vi.fn(async (resource: string) => {
      if (resource === `${base}/auth/me`) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            userId,
            role: "ADMINISTRATOR",
          }),
        };
      }

      if (resource === `${base}/auth/logout`) {
        return {
          ok: false,
          status: 503,
        };
      }

      throw new Error("Requisicao inesperada.");
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<AdminPage />);

    const { user, drawer } = await openDrawer();

    await user.click(
      within(drawer).getByRole("button", {
        name: "Sair da conta",
      }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Não foi possível sair da conta",
    );

    expect(replace).not.toHaveBeenCalled();
  });
});