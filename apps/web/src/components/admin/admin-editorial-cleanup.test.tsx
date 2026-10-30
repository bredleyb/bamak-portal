import { fireEvent, render, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import AdminLoginPage from "../../app/admin/login/page";
import AdminPage from "../../app/admin/page";
import AdminSettingsPage from "../../app/admin/configuracoes/page";
import AdminUsersPage from "../../app/admin/configuracoes/usuarios/page";

const replace = vi.hoisted(() => vi.fn());
const apiBase = "http://localhost:3001/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("Auditoria editorial das telas administrativas", () => {
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

  it("ADM-01: remove instruções e apresentação redundantes", async () => {
    render(await AdminLoginPage({}));

    expect(
      screen.getByRole("heading", { name: "Entrar no painel" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("ACESSO DA EQUIPE"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        /utilize suas credenciais de acesso/i,
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        /atendimentos, publicações e documentos internos/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("ADM-01: elimina placeholders que repetem os rótulos", async () => {
    render(await AdminLoginPage({}));

    expect(
      screen.getByRole("textbox", { name: "E-mail" }),
    ).not.toHaveAttribute("placeholder");

    expect(
      screen.getByLabelText("Senha"),
    ).not.toHaveAttribute("placeholder");
  });

  it("ADM-01: usa mensagem de conexão sem terminologia de API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Falha interna de teste")),
    );

    render(await AdminLoginPage({}));

    fireEvent.change(
      screen.getByRole("textbox", { name: "E-mail" }),
      { target: { value: "operador@example.test" } },
    );

    fireEvent.change(
      screen.getByLabelText("Senha"),
      { target: { value: "SenhaFicticia123!" } },
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Entrar no painel" }),
    );

    expect(
      await screen.findByText("Não foi possível acessar o serviço"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/conectar à API/i),
    ).not.toBeInTheDocument();
  });

  it("ADM-02: apresenta a visão geral sem explicações redundantes", async () => {
    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    expect(
      screen.queryByText("PAINEL ADMINISTRATIVO"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Atendimentos e pendências da operação."),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Situações que exigem acompanhamento."),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Pendências operacionais" }),
    ).toBeInTheDocument();
  });

  it("Navegação: não exibe mensagens internas de desenvolvimento", async () => {
    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    expect(
      document.querySelectorAll(
        '[title="Funcionalidade em desenvolvimento"]',
      ),
    ).toHaveLength(0);
  });

  it("ADM-11: mantém apenas o título Configurações", async () => {
    render(<AdminSettingsPage />);

    await screen.findByRole("heading", {
      level: 1,
      name: "Configurações",
    });

    expect(
      screen.queryByText("CONFIGURAÇÕES"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        /acesso à conta, usuários e parâmetros operacionais/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("ADM-11: remove textos técnicos e configuração fictícia", async () => {
    render(<AdminSettingsPage />);

    await screen.findByRole("heading", {
      name: "Segurança da conta",
    });

    expect(
      screen.queryByText(
        /alteração de senha e encerramento de sessões precisam/i,
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        /destinatários e configuração do serviço dependem/i,
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        /criação, desativação e perfil de acesso são operações/i,
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Envio de notificações",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Gerenciar usuários",
      }),
    ).toHaveAttribute(
      "href",
      "/admin/configuracoes/usuarios",
    );
  });

  it("ADM-12: remove a instrução introdutória", async () => {
    render(<AdminUsersPage />);

    await screen.findByRole("heading", {
      name: "Usuários e acessos",
    });

    expect(
      screen.queryByText(
        /administre quem pode acessar o painel/i,
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Acessos cadastrados",
      }),
    ).toBeInTheDocument();
  });

  it("preserva o aviso funcional de sessão expirada", async () => {
    render(
      await AdminLoginPage({
        searchParams: Promise.resolve({
          reason: "session-expired",
        }),
      }),
    );

    expect(
      screen.getByText("Sua sessão expirou"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Entre novamente para continuar no painel.",
      ),
    ).toBeInTheDocument();
  });
});
