import { render, screen, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { AdminSessionGate } from "./admin-session-gate";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("AdminSessionGate — protecao da area administrativa", () => {
  const userId = "00000000-0000-4000-8000-000000000001";

  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "/api");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  function mount() {
    render(
      <AdminSessionGate>
        <div>Conteúdo administrativo protegido</div>
      </AdminSessionGate>,
    );
  }

  function mockIdentity(role: string) {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ userId, role }),
    });

    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("nao revela conteudo enquanto a sessao e consultada", async () => {
    const fetchMock = vi.fn().mockReturnValue(
      new Promise(() => {}),
    );

    vi.stubGlobal("fetch", fetchMock);
    mount();

    expect(
      await screen.findByRole("status"),
    ).toHaveTextContent(/verificando acesso/i);

    expect(
      screen.queryByText("Conteúdo administrativo protegido"),
    ).not.toBeInTheDocument();

    expect(replace).not.toHaveBeenCalled();
  });

  it("permite administrador autenticado e exige cookies", async () => {
    const fetchMock = mockIdentity("ADMINISTRATOR");
    mount();

    expect(
      await screen.findByText("Conteúdo administrativo protegido"),
    ).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/me",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
    );

    expect(replace).not.toHaveBeenCalled();
  });

  it("permite operador em area administrativa comum", async () => {
    mockIdentity("OPERATOR");
    mount();

    expect(
      await screen.findByText("Conteúdo administrativo protegido"),
    ).toBeInTheDocument();

    expect(replace).not.toHaveBeenCalled();
  });

  it("redireciona a sessao ausente ou invalida", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    );

    mount();

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/admin/login");
    });

    expect(
      screen.queryByText("Conteúdo administrativo protegido"),
    ).not.toBeInTheDocument();
  });

  it("nega acesso quando a API retorna 403", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
      }),
    );

    mount();

    expect(
      await screen.findByText("Acesso negado"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Conteúdo administrativo protegido"),
    ).not.toBeInTheDocument();
  });

  it("falha de forma segura diante de HTTP 503", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    mount();

    expect(
      await screen.findByText("Não foi possível verificar o acesso"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Conteúdo administrativo protegido"),
    ).not.toBeInTheDocument();
  });

  it("falha de forma segura diante de erro de conexao", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Falha fictícia")),
    );

    mount();

    expect(
      await screen.findByText("Não foi possível verificar o acesso"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Conteúdo administrativo protegido"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Falha fictícia"),
    ).not.toBeInTheDocument();
  });

  it("rejeita perfil nao reconhecido mesmo com HTTP 200", async () => {
    mockIdentity("PERFIL_DESCONHECIDO");
    mount();

    expect(
      await screen.findByText("Acesso negado"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Conteúdo administrativo protegido"),
    ).not.toBeInTheDocument();
  });
});