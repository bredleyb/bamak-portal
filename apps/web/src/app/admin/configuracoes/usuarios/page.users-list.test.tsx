import { render, screen } from "@testing-library/react";
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

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

type ApiReply = {
  ok: boolean;
  status: number;
  json?: () => Promise<unknown>;
};

const apiBase = "http://localhost:3001/api";

const identity = {
  userId: "00000000-0000-4000-8000-000000000001",
  role: "ADMINISTRATOR",
};

function okUsers(users: unknown[]): Promise<ApiReply> {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({ users }),
  });
}

function stubUsersRequest(
  reply: () => Promise<ApiReply>,
) {
  const fetchMock = vi.fn((url: string) => {
    if (url === `${apiBase}/auth/me`) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => identity,
      });
    }

    if (url === `${apiBase}/admin/users`) {
      return reply();
    }

    return Promise.reject(
      new Error("Requisição inesperada no teste."),
    );
  });

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

describe("ADM-12 — listagem de contas administrativas", () => {
  beforeEach(() => {
    replace.mockReset();

    vi.stubEnv(
      "NEXT_PUBLIC_API_URL",
      apiBase,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("indica carregamento enquanto aguarda a API", async () => {
    stubUsersRequest(
      () => new Promise<ApiReply>(() => {}),
    );

    render(<AdminUsersPage />);

    await screen.findByRole("heading", {
      name: "Usuários e acessos",
    });

    expect(
      await screen.findByText("Carregando usuários…"),
    ).toBeInTheDocument();
  });

  it("lista contas retornadas pela API usando sessão sem cache", async () => {
    const fetchMock = stubUsersRequest(() =>
      okUsers([
        {
          id: "00000000-0000-4000-8000-000000000010",
          name: "Ana Exemplo",
          email: "ana@example.test",
          role: "ADMINISTRATOR",
          isActive: true,
          createdAt: "2026-10-01T12:00:00.000Z",
          updatedAt: "2026-10-20T12:00:00.000Z",
        },
        {
          id: "00000000-0000-4000-8000-000000000011",
          name: "Bruno Exemplo",
          email: "bruno@example.test",
          role: "OPERATOR",
          isActive: false,
          createdAt: "2026-10-02T12:00:00.000Z",
          updatedAt: "2026-10-21T12:00:00.000Z",
        },
      ]),
    );

    render(<AdminUsersPage />);

    expect(
      await screen.findByText("Ana Exemplo"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("ana@example.test"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Bruno Exemplo"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("bruno@example.test"),
    ).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledWith(
      `${apiBase}/admin/users`,
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }),
    );
  });

  it("apresenta estado vazio quando não há contas", async () => {
    stubUsersRequest(() => okUsers([]));

    render(<AdminUsersPage />);

    expect(
      await screen.findByText("Nenhum acesso cadastrado."),
    ).toBeInTheDocument();
  });

  it("informa acesso negado quando a API retorna 403", async () => {
    stubUsersRequest(() =>
      Promise.resolve({
        ok: false,
        status: 403,
      }),
    );

    render(<AdminUsersPage />);

    expect(
      await screen.findByText(
        "Acesso negado ao consultar usuários.",
      ),
    ).toBeInTheDocument();
  });

  it("trata erro HTTP sem apresentar detalhes internos", async () => {
    stubUsersRequest(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      }),
    );

    render(<AdminUsersPage />);

    expect(
      await screen.findByText(
        "Não foi possível carregar os usuários.",
      ),
    ).toBeInTheDocument();
  });

  it("trata falha de conexão sem expor sua causa", async () => {
    const sensitiveDetail = "segredo-interno-ficticio";

    stubUsersRequest(() =>
      Promise.reject(new Error(sensitiveDetail)),
    );

    render(<AdminUsersPage />);

    expect(
      await screen.findByText(
        "Não foi possível carregar os usuários.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(sensitiveDetail),
    ).not.toBeInTheDocument();
  });
});
