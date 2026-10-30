import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
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
import AdminUsersPage from "./page";

const replace = vi.hoisted(() => vi.fn());
const apiBase = "http://localhost:3001/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const css = readFileSync(
  resolve(
    process.cwd(),
    "src/app/admin/configuracoes/usuarios/page.css",
  ),
  "utf8",
);

const user = {
  id: "00000000-0000-4000-8000-000000000010",
  name: "Ana Exemplo",
  email: "ana@example.test",
  role: "ADMINISTRATOR",
  isActive: true,
  createdAt: "2026-10-01T12:00:00.000Z",
  updatedAt: "2026-10-20T12:00:00.000Z",
};

function cssRule(selector: RegExp): string {
  return css.match(selector)?.[1] ?? "";
}

describe("ADM-12 — auditoria de produto consolidada", () => {
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
              userId: user.id,
              role: "ADMINISTRATOR",
            }),
          };
        }

        if (url === `${apiBase}/admin/users`) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ users: [user] }),
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

  it("remove explicações internas da tela de usuários", async () => {
    render(<AdminUsersPage />);

    await screen.findByText("Ana Exemplo");

    expect(
      screen.queryByRole("heading", {
        name: "Perfis e responsabilidades",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        /a interface deve ocultar ações não autorizadas/i,
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        /a listagem usa dados de contas provisionadas/i,
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        /a concessão, revogação e recuperação de acesso/i,
      ),
    ).not.toBeInTheDocument();
  });

  it("preserva dados e controles da conta durante a limpeza", async () => {
    render(<AdminUsersPage />);

    await screen.findByText("Ana Exemplo");

    const account = screen.getByText("Ana Exemplo").closest("li");

    expect(account).not.toBeNull();

    const row = within(account as HTMLElement);

    expect(row.getByText(user.email)).toBeInTheDocument();
    expect(row.getByText("Administrador")).toBeInTheDocument();
    expect(row.getByText("Ativo")).toBeInTheDocument();

    expect(
      row.getByText(/Última alteração: 20\/10\/2026/),
    ).toBeInTheDocument();

    expect(
      row.getByRole("button", {
        name: "Revisar permissões",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Adicionar usuário",
      }),
    ).toBeEnabled();
  });

  it("empilha os dados da conta em desktop", () => {
    const rule = cssRule(
      /\.bamak-admin-users__list-item\s*\{([^}]*)\}/,
    );

    expect(rule).toMatch(
      /grid-template-columns:\s*minmax\(0,\s*1fr\)\s*;/,
    );
  });

  it("apresenta Revisar permissões como ação textual", () => {
    const rule = cssRule(
      /\.bamak-admin-settings__card\s+\.bamak-admin-users__review\s*\{([^}]*)\}/,
    );

    expect(rule).toMatch(/border:\s*0\s*;/);
    expect(rule).toMatch(/padding:\s*0\s*;/);
    expect(rule).toMatch(/min-height:\s*20px\s*;/);
  });

  it("não expande a ação textual na versão mobile", () => {
    const mobile = cssRule(
      /@media \(max-width: 767px\)\s*\{\s*\.bamak-admin-settings__card\s+\.bamak-admin-users__review\s*\{([^}]*)\}/,
    );

    expect(mobile).not.toMatch(/width:\s*100%\s*;/);
  });

  it("preserva os divisores entre as contas", () => {
    const list = cssRule(
      /\.bamak-admin-users__list\s*\{([^}]*)\}/,
    );

    const account = cssRule(
      /\.bamak-admin-users__list-item\s*\{([^}]*)\}/,
    );

    expect(list).toMatch(
      /border-top:\s*1px solid var\(--semantic-border-subtle\)/,
    );

    expect(account).toMatch(
      /border-bottom:\s*1px solid var\(--semantic-border-subtle\)/,
    );
  });
});
