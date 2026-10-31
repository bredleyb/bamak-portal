import {
  act,
  render,
  screen,
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
import { LoginForm } from "./login-form";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("LoginForm — estados ADM-01", () => {
  const email = "operador@example.invalid";
  const password = "SenhaFicticia123!";

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

  async function fillCredentials() {
    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: "E-mail" }),
      email,
    );

    await user.type(
      screen.getByLabelText("Senha"),
      password,
    );

    return user;
  }

  it("apresenta a mensagem generica definida no Figma para 401", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm />);

    const user = await fillCredentials();

    await user.click(
      screen.getByRole("button", {
        name: "Entrar no painel",
      }),
    );

    expect(
      await screen.findByText("Não foi possível entrar"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Confira as credenciais e tente novamente.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/senha incorreta|usuário inexistente/i),
    ).not.toBeInTheDocument();

    expect(replace).not.toHaveBeenCalled();
  });

  it("mantem o botao ocupado e impede novo envio durante login", async () => {
    let resolveRequest:
      | ((response: { ok: boolean; status: number }) => void)
      | undefined;

    const pendingRequest = new Promise<{
      ok: boolean;
      status: number;
    }>((resolve) => {
      resolveRequest = resolve;
    });

    const fetchMock = vi.fn().mockReturnValue(pendingRequest);

    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm />);

    const user = await fillCredentials();

    await user.click(
      screen.getByRole("button", {
        name: "Entrar no painel",
      }),
    );

    const loadingButton = screen.getByRole("button", {
      name: /validando acesso/i,
    });

    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute(
      "aria-busy",
      "true",
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(loadingButton);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    if (!resolveRequest) {
      throw new Error("Requisicao pendente nao inicializada.");
    }

    const finishRequest = resolveRequest;

    await act(async () => {
      finishRequest({ ok: true, status: 200 });
    });

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/admin");
    });
  });

  it("exibe o aviso de sessao expirada antes de novo login", () => {
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    render(<LoginForm sessionExpired />);

    expect(
      screen.getByText("Sua sessão expirou"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Entre novamente para continuar no painel.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "E-mail" }),
    ).toBeEnabled();

    expect(
      screen.getByLabelText("Senha"),
    ).toBeEnabled();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });
});