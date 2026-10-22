import { render, screen } from "@testing-library/react";
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

describe("LoginForm — validação acessível ADM-01", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    replace.mockReset();
    fetchMock.mockReset();

    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv(
      "NEXT_PUBLIC_API_URL",
      "http://localhost:3001/api",
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("exibe os erros do Figma ao enviar campos vazios", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(
      screen.getByRole("button", { name: "Entrar no painel" }),
    );

    expect(
      screen.getByText("Informe o e-mail de acesso."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Informe sua senha."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "E-mail" }),
    ).toHaveAttribute("placeholder", "");

    expect(
      screen.getByLabelText("Senha"),
    ).toHaveAttribute("placeholder", "");

    expect(
      screen.getByRole("textbox", { name: "E-mail" }),
    ).toHaveAttribute("aria-invalid", "true");

    expect(
      screen.getByLabelText("Senha"),
    ).toHaveAttribute("aria-invalid", "true");

    expect(
      screen.getByRole("button", { name: "Entrar no painel" }),
    ).toBeDisabled();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejeita um e-mail com formato invalido", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: "E-mail" }),
      "email-invalido",
    );

    await user.type(
      screen.getByLabelText("Senha"),
      "SenhaFicticia123!",
    );

    await user.click(
      screen.getByRole("button", { name: "Entrar no painel" }),
    );

    expect(
      screen.getByText("Informe um e-mail válido."),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Informe sua senha."),
    ).not.toBeInTheDocument();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("identifica apenas a senha ausente", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: "E-mail" }),
      "operador@example.invalid",
    );

    await user.click(
      screen.getByRole("button", { name: "Entrar no painel" }),
    );

    expect(
      screen.getByText("Informe sua senha."),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Informe o e-mail de acesso."),
    ).not.toBeInTheDocument();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("limpa erros e reabilita o botao apos correcoes", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(
      screen.getByRole("button", { name: "Entrar no painel" }),
    );

    expect(
      screen.getByText("Informe o e-mail de acesso."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Informe sua senha."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Entrar no painel" }),
    ).toBeDisabled();

    await user.type(
      screen.getByRole("textbox", { name: "E-mail" }),
      "operador@example.invalid",
    );

    await user.type(
      screen.getByLabelText("Senha"),
      "SenhaFicticia123!",
    );

    expect(
      screen.queryByText("Informe o e-mail de acesso."),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Informe sua senha."),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Entrar no painel" }),
    ).toBeEnabled();

    expect(fetchMock).not.toHaveBeenCalled();
  });
});