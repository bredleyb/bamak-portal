import {
  fireEvent,
  render,
  screen,
  waitFor,
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
import AdminPage, { metadata } from "./page";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("ADM-02 — rota administrativa protegida", () => {
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

  function mockSession(role: "ADMINISTRATOR" | "OPERATOR") {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ userId, role }),
    });

    vi.stubGlobal("fetch", fetchMock);

    return fetchMock;
  }

  it("nao permite indexacao da rota administrativa", () => {
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("oculta o painel enquanto verifica a sessao", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(new Promise(() => {})),
    );

    render(<AdminPage />);

    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(/verificando acesso/i);

    expect(
      screen.queryByRole("heading", {
        name: "Visão geral",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Entradas recentes"),
    ).not.toBeInTheDocument();
  });

  it("redireciona visitantes sem sessao para o login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    );

    render(<AdminPage />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/admin/login");
    });

    expect(
      screen.queryByRole("heading", {
        name: "Visão geral",
      }),
    ).not.toBeInTheDocument();
  });

  it("libera a visao geral ao administrador autenticado", async () => {
    const fetchMock = mockSession("ADMINISTRATOR");

    render(<AdminPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Visão geral",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("PAINEL ADMINISTRATIVO"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Atendimentos e pendências da operação.",
      ),
    ).toBeInTheDocument();

    const nav = screen.getByRole("navigation", {
      name: "Navegação administrativa",
    });

    expect(within(nav).getByText("Painel")).toBeInTheDocument();
    expect(within(nav).getByText("Atendimentos")).toBeInTheDocument();
    expect(within(nav).getByText("Comunicação")).toBeInTheDocument();
    expect(within(nav).getByText("Configurações")).toBeInTheDocument();

    expect(screen.getByText("Entradas recentes")).toBeInTheDocument();
    expect(screen.getByText("Pendências operacionais")).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/me",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
    );
  });

  it("permite ao operador acessar o painel compartilhado", async () => {
    mockSession("OPERATOR");

    render(<AdminPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Visão geral",
      }),
    ).toBeInTheDocument();

    expect(replace).not.toHaveBeenCalled();
  });

  it("identifica o administrador conforme o Figma", async () => {
    mockSession("ADMINISTRATOR");

    render(<AdminPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Visão geral",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Administrador").length,
    ).toBeGreaterThanOrEqual(2);

    expect(
      screen.getByText("ADM"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Equipe"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Área da equipe"),
    ).not.toBeInTheDocument();

    const sidebar = screen.getByRole("navigation", {
      name: "Navegação administrativa",
    });

    expect(
      within(sidebar).getByText("Painel"),
    ).toBeInTheDocument();

    expect(
      within(sidebar).getByText("Atendimentos"),
    ).toBeInTheDocument();

    expect(
      within(sidebar).getByText("Comunicação"),
    ).toBeInTheDocument();

    expect(
      within(sidebar).getByText("Configurações"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir menu administrativo",
      }),
    );

    const mobile = within(
      screen.getByRole("dialog", {
        name: "Menu administrativo",
      }),
    ).getByRole("navigation", {
      name: "Navegação do menu administrativo",
    });

    expect(
      within(mobile).getByText("Comunicação"),
    ).toBeInTheDocument();

    expect(
      within(mobile).getByText("Configurações"),
    ).toBeInTheDocument();
  });

  it("restringe a navegacao do operador conforme o Figma", async () => {
    mockSession("OPERATOR");

    render(<AdminPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Visão geral",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Operador").length,
    ).toBeGreaterThanOrEqual(2);

    expect(
      screen.getByText("OPR"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Equipe"),
    ).not.toBeInTheDocument();

    const sidebar = screen.getByRole("navigation", {
      name: "Navegação administrativa",
    });

    expect(
      within(sidebar).getByText("Painel"),
    ).toBeInTheDocument();

    expect(
      within(sidebar).getByText("Atendimentos"),
    ).toBeInTheDocument();

    expect(
      within(sidebar).queryByText("Comunicação"),
    ).not.toBeInTheDocument();

    expect(
      within(sidebar).queryByText("Configurações"),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir menu administrativo",
      }),
    );

    const mobile = within(
      screen.getByRole("dialog", {
        name: "Menu administrativo",
      }),
    ).getByRole("navigation", {
      name: "Navegação do menu administrativo",
    });

    expect(
      within(mobile).getByText("Painel"),
    ).toBeInTheDocument();

    expect(
      within(mobile).getByText("Atendimentos"),
    ).toBeInTheDocument();

    expect(
      within(mobile).queryByText("Comunicação"),
    ).not.toBeInTheDocument();

    expect(
      within(mobile).queryByText("Configurações"),
    ).not.toBeInTheDocument();
  });
  it("nao revela o painel se a API estiver indisponivel", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    render(<AdminPage />);

    expect(
      await screen.findByText(
        "Não foi possível verificar o acesso",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Visão geral",
      }),
    ).not.toBeInTheDocument();
  });
});