import {
  act,
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

describe("ADM-02 — menu de perfil nas telas maiores", () => {
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

  async function openAccountOptions() {
    const user = userEvent.setup();

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    const trigger = screen.getByRole("button", {
      name: "Abrir opções da conta",
    });

    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    const options = screen.getByRole("group", {
      name: "Opções da conta",
    });

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    return { user, trigger, options };
  }

  it("exibe logout somente ao abrir as opcoes do administrador", async () => {
    mockAuthenticated("ADMINISTRATOR");
    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    expect(
      screen.queryByRole("group", {
        name: "Opções da conta",
      }),
    ).not.toBeInTheDocument();

    const { options } = await openAccountOptions();

    expect(
      within(options).getByText("Administrador"),
    ).toBeInTheDocument();

    expect(
      within(options).getByRole("button", {
        name: "Sair da conta",
      }),
    ).toBeInTheDocument();
  });

  it("identifica o operador no menu de perfil", async () => {
    mockAuthenticated("OPERATOR");
    render(<AdminPage />);

    const { options } = await openAccountOptions();

    expect(
      within(options).getByText("Operador"),
    ).toBeInTheDocument();

    expect(
      within(options).getByRole("button", {
        name: "Sair da conta",
      }),
    ).toBeInTheDocument();

    expect(
      within(options).queryByText("Administrador"),
    ).not.toBeInTheDocument();
  });

  it("fecha com Escape e devolve o foco ao perfil", async () => {
    mockAuthenticated("ADMINISTRATOR");
    render(<AdminPage />);

    const { user, trigger } = await openAccountOptions();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("group", {
        name: "Opções da conta",
      }),
    ).not.toBeInTheDocument();

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("fecha ao clicar fora das opcoes da conta", async () => {
    mockAuthenticated("ADMINISTRATOR");
    render(<AdminPage />);

    const { user, trigger } = await openAccountOptions();

    await user.click(
      screen.getByRole("heading", {
        name: "Visão geral",
      }),
    );

    expect(
      screen.queryByRole("group", {
        name: "Opções da conta",
      }),
    ).not.toBeInTheDocument();

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("aguarda HTTP 204 antes de redirecionar no logout", async () => {
    let resolveLogout:
      | ((value: { ok: boolean; status: number }) => void)
      | undefined;

    const pendingLogout = new Promise<{
      ok: boolean;
      status: number;
    }>((resolve) => {
      resolveLogout = resolve;
    });

    const fetchMock = vi.fn((resource: string) => {
      if (resource === `${base}/auth/me`) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            userId,
            role: "ADMINISTRATOR",
          }),
        });
      }

      if (resource === `${base}/auth/logout`) {
        return pendingLogout;
      }

      return Promise.reject(
        new Error("Requisicao inesperada."),
      );
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<AdminPage />);

    const { user, options } = await openAccountOptions();

    await user.click(
      within(options).getByRole("button", {
        name: "Sair da conta",
      }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `${base}/auth/logout`,
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      }),
    );

    expect(replace).not.toHaveBeenCalled();

    await act(async () => {
      resolveLogout?.({ ok: true, status: 204 });
      await pendingLogout;
    });

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("informa falha de logout sem encerrar falsamente a sessao", async () => {
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

    const { user, options } = await openAccountOptions();

    await user.click(
      within(options).getByRole("button", {
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