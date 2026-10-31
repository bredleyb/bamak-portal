import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminUsersPage from "./page";

const replace = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

const base = "http://localhost:3001/api";
const adminId = "00000000-0000-4000-8000-000000000010";
const operatorId = "00000000-0000-4000-8000-000000000011";

const admin = {
  id: adminId,
  name: "Ana Exemplo",
  email: "ana@example.test",
  role: "ADMINISTRATOR",
  isActive: true,
  createdAt: "2026-10-01T12:00:00.000Z",
  updatedAt: "2026-10-20T12:00:00.000Z",
};
const operator = {
  id: operatorId,
  name: "Bruno Exemplo",
  email: "bruno@example.test",
  role: "OPERATOR",
  isActive: true,
  createdAt: "2026-10-02T12:00:00.000Z",
  updatedAt: "2026-10-21T12:00:00.000Z",
};

type Reply = { ok: boolean; status: number; json?: () => Promise<unknown> };
function ok(user: unknown): Reply {
  return { ok: true, status: 200, json: async () => ({ user }) };
}

function setup(
  patch: (url: string, options: RequestInit) => Promise<Reply>,
) {
  let records = [admin, operator];
  const fetchMock = vi.fn(async (url: string, options?: RequestInit) => {
    if (url === `${base}/auth/me`) {
      return okIdentity();
    }
    if (url === `${base}/admin/users` && options?.method === "GET") {
      return {
        ok: true,
        status: 200,
        json: async () => ({ users: records }),
      };
    }
    if (url.startsWith(`${base}/admin/users/`) && options?.method === "PATCH") {
      const response = await patch(url, options);
      if (response.ok && response.json) {
        const payload = await response.json();
        const changed = (payload as { user?: typeof operator }).user;
        if (changed?.id === operatorId) {
          records = [admin, changed];
        }
        return { ...response, json: async () => payload };
      }
      return response;
    }
    throw new Error(`Requisição inesperada: ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function okIdentity(): Reply {
  return {
    ok: true,
    status: 200,
    json: async () => ({ userId: adminId, role: "ADMINISTRATOR" }),
  };
}

function account(name: string) {
  const row = screen.getByText(name).closest("li");
  if (!row) throw new Error("Conta ausente");
  return within(row);
}

async function selectAdministrator(
  actor: ReturnType<typeof userEvent.setup>,
  panel: ReturnType<typeof within>,
) {
  await actor.click(panel.getByRole("combobox", { name: "Perfil de acesso" }));
  const options = panel.getByRole("listbox", { name: "Perfil de acesso" });
  await actor.click(within(options).getByRole("option", { name: "Administrador" }));
}

async function editOperator() {
  const actor = userEvent.setup();
  render(<AdminUsersPage />);
  await screen.findByText("Bruno Exemplo");
  await actor.click(account("Bruno Exemplo").getByRole("button", { name: "Revisar permissões" }));
  const panel = screen.getByRole("region", { name: "Permissões de Bruno Exemplo" });
  return { actor, panel: within(panel) };
}

describe("ADM-12 — revisão real de permissões", () => {
  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv("NEXT_PUBLIC_API_URL", base);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("remove o outline global duplicado do foco do seletor", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/app/admin/configuracoes/usuarios/page.css"),
      "utf8",
    );
    const focusRule = css.match(
      /\.bamak-admin-users__access-panel \.bamak-admin-users__role-trigger:focus-visible\s*\{([^}]*)\}/,
    )?.[1] ?? "";
    expect(focusRule).toMatch(/border:\s*2px solid var\(--semantic-field-border-focus\)/);
    expect(focusRule).toMatch(/outline:\s*none/);
  });

  it("protege a própria conta e habilita a revisão de outras", async () => {
    setup(async () => { throw new Error("PATCH inesperado"); });
    render(<AdminUsersPage />);
    await screen.findByText("Bruno Exemplo");
    expect(account("Ana Exemplo").getByRole("button", { name: "Revisar permissões" })).toBeDisabled();
    expect(account("Bruno Exemplo").getByRole("button", { name: "Revisar permissões" })).toBeEnabled();
  });

  it("abre a edição e fecha sem enviar mudanças", async () => {
    const fetchMock = setup(async () => { throw new Error("PATCH inesperado"); });
    const { actor, panel } = await editOperator();
    expect(panel.getByRole("combobox", { name: "Perfil de acesso" })).toHaveTextContent("Operador");
    expect(panel.getByRole("button", { name: "Salvar perfil" })).toBeDisabled();
    await actor.click(panel.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("region", { name: "Permissões de Bruno Exemplo" })).not.toBeInTheDocument();
    expect(fetchMock.mock.calls.every(([, options]) => options?.method !== "PATCH")).toBe(true);
  });

  it("usa o mesmo seletor personalizado do cadastro, inclusive pelo teclado", async () => {
    setup(async () => { throw new Error("PATCH inesperado"); });
    const { actor, panel } = await editOperator();
    const picker = panel.getByRole("combobox", { name: "Perfil de acesso" });
    expect(picker.tagName).toBe("BUTTON");
    expect(picker).toHaveAttribute("aria-haspopup", "listbox");
    expect(picker).toHaveFocus();
    expect(
      screen.getByRole("region", { name: "Permissões de Bruno Exemplo" }).querySelector("select"),
    ).toBeNull();
    await actor.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(picker).toHaveTextContent("Administrador");
    expect(panel.getByRole("button", { name: "Salvar perfil" })).toBeEnabled();
    await actor.keyboard("{ArrowDown}{Escape}");
    expect(picker).toHaveAttribute("aria-expanded", "false");
  });

  it("altera o perfil via PATCH autenticado, confere a resposta e recarrega a lista", async () => {
    const fetchMock = setup(async (_url, options) => {
      expect(JSON.parse(String(options.body))).toEqual({ role: "ADMINISTRATOR" });
      return ok({ ...operator, role: "ADMINISTRATOR" });
    });
    const { actor, panel } = await editOperator();
    await selectAdministrator(actor, panel);
    await actor.click(panel.getByRole("button", { name: "Salvar perfil" }));
    expect(await screen.findByText("Perfil atualizado com sucesso.")).toBeInTheDocument();
    await waitFor(() => expect(account("Bruno Exemplo").getByText("Administrador")).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      `${base}/admin/users/${operatorId}/role`,
      expect.objectContaining({ method: "PATCH", credentials: "include", cache: "no-store" }),
    );
  });

  it("só desativa após confirmação explícita e atualiza a situação", async () => {
    const fetchMock = setup(async (_url, options) => {
      expect(JSON.parse(String(options.body))).toEqual({ isActive: false });
      return ok({ ...operator, isActive: false });
    });
    const { actor, panel } = await editOperator();
    await actor.click(panel.getByRole("button", { name: "Desativar acesso" }));
    expect(fetchMock.mock.calls.filter(([, opts]) => opts?.method === "PATCH")).toHaveLength(0);
    await actor.click(panel.getByRole("button", { name: "Confirmar desativação" }));
    expect(await screen.findByText("Acesso desativado com sucesso.")).toBeInTheDocument();
    await waitFor(() => expect(account("Bruno Exemplo").getByText("Inativo")).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      `${base}/admin/users/${operatorId}/active`,
      expect.objectContaining({ method: "PATCH", credentials: "include" }),
    );
  });

  it("permite recuar da confirmação sem PATCH", async () => {
    const fetchMock = setup(async () => { throw new Error("PATCH inesperado"); });
    const { actor, panel } = await editOperator();
    await actor.click(panel.getByRole("button", { name: "Desativar acesso" }));
    await actor.click(panel.getByRole("button", { name: "Voltar" }));
    expect(panel.getByRole("button", { name: "Desativar acesso" })).toBeEnabled();
    expect(fetchMock.mock.calls.some(([, opts]) => opts?.method === "PATCH")).toBe(false);
  });

  it("reativa uma conta inativa", async () => {
    const actor = userEvent.setup();
    const patch = vi.fn(async (_url: string, options: RequestInit) => {
      expect(JSON.parse(String(options.body))).toEqual({ isActive: true });
      return ok({ ...operator, isActive: true });
    });
    vi.stubGlobal("fetch", vi.fn(async (url: string, options?: RequestInit) => {
      if (url === `${base}/auth/me`) return okIdentity();
      if (url === `${base}/admin/users` && options?.method === "GET") {
        return { ok: true, status: 200, json: async () => ({ users: [admin, { ...operator, isActive: false }] }) };
      }
      if (url === `${base}/admin/users/${operatorId}/active` && options?.method === "PATCH") {
        return patch(url, options);
      }
      throw new Error("Requisição inesperada");
    }));
    render(<AdminUsersPage />);
    await screen.findByText("Bruno Exemplo");
    await actor.click(account("Bruno Exemplo").getByRole("button", { name: "Revisar permissões" }));
    const panel = within(screen.getByRole("region", { name: "Permissões de Bruno Exemplo" }));
    await actor.click(panel.getByRole("button", { name: "Reativar acesso" }));
    await actor.click(panel.getByRole("button", { name: "Confirmar reativação" }));
    expect(await screen.findByText("Acesso reativado com sucesso.")).toBeInTheDocument();
    expect(patch).toHaveBeenCalledTimes(1);
  });

  it("trata conflito 409 do último Administrador sem sobrescrever dados", async () => {
    setup(async () => ({ ok: false, status: 409 }));
    const { actor, panel } = await editOperator();
    await selectAdministrator(actor, panel);
    await actor.click(panel.getByRole("button", { name: "Salvar perfil" }));
    expect(await panel.findByRole("alert")).toHaveTextContent("administrador ativo");
    expect(
      account("Bruno Exemplo").getByText("Operador", {
        selector: ".bamak-admin-users__details > span",
      }),
    ).toBeInTheDocument();
  });

  it("redireciona no 401 durante alteração", async () => {
    setup(async () => ({ ok: false, status: 401 }));
    const { actor, panel } = await editOperator();
    await selectAdministrator(actor, panel);
    await actor.click(panel.getByRole("button", { name: "Salvar perfil" }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/admin/login"));
  });

  it.each([
    { code: 403, fragment: "permissão" },
    { code: 404, fragment: "não encontrada" },
    { code: 500, fragment: "Tente novamente" },
  ])("mostra mensagem segura para HTTP $code", async ({ code, fragment }) => {
    setup(async () => ({ ok: false, status: code }));
    const { actor, panel } = await editOperator();
    await selectAdministrator(actor, panel);
    await actor.click(panel.getByRole("button", { name: "Salvar perfil" }));
    expect(await panel.findByRole("alert")).toHaveTextContent(fragment);
  });

  it("rejeita resposta HTTP 200 inconsistente sem confirmar sucesso", async () => {
    setup(async () => ok({ ...operator, id: adminId, role: "ADMINISTRATOR" }));
    const { actor, panel } = await editOperator();
    await selectAdministrator(actor, panel);
    await actor.click(panel.getByRole("button", { name: "Salvar perfil" }));
    expect(await panel.findByRole("alert")).toHaveTextContent("Não foi possível confirmar");
    expect(screen.queryByText("Perfil atualizado com sucesso.")).not.toBeInTheDocument();
  });

  it("bloqueia cliques simultâneos e apresenta falha de rede sem vazamento", async () => {
    let rejectRequest: (reason?: unknown) => void = () => {};
    const fetchMock = setup(() => new Promise<Reply>((_resolve, reject) => {
      rejectRequest = reject;
    }));
    const { actor, panel } = await editOperator();
    await selectAdministrator(actor, panel);
    await actor.click(panel.getByRole("button", { name: "Salvar perfil" }));
    expect(panel.getByRole("button", { name: "Salvar perfil" })).toBeDisabled();
    expect(fetchMock.mock.calls.filter(([, opts]) => opts?.method === "PATCH")).toHaveLength(1);
    rejectRequest(new Error("segredo-interno-ficticio"));
    expect(await panel.findByRole("alert")).toHaveTextContent("Tente novamente");
    expect(screen.queryByText("segredo-interno-ficticio")).not.toBeInTheDocument();
  });
});
