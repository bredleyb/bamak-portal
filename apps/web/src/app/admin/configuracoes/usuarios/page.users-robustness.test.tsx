import {
  render,
  screen,
  waitFor,
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

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const apiBase = "http://localhost:3001/api";

const identity = {
  userId: "00000000-0000-4000-8000-000000000001",
  role: "ADMINISTRATOR",
};

function stubUsersResponse(
  reply: () => Promise<unknown>,
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

describe("ADM-12 — robustez e segurança da listagem", () => {
  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv("NEXT_PUBLIC_API_URL", apiBase);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("redireciona ao login se a sessão expirar durante a listagem", async () => {
    stubUsersResponse(() =>
      Promise.resolve({
        ok: false,
        status: 401,
      }),
    );

    render(<AdminUsersPage />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(
        "/admin/login",
      );
    });

    expect(
      screen.queryByText("Não foi possível carregar os usuários."),
    ).not.toBeInTheDocument();
  });

  it("rejeita uma lista com dados incompatíveis", async () => {
    stubUsersResponse(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          users: [
            {
              id: "00000000-0000-4000-8000-000000000010",
              name: "Conta Fictícia",
              email: "conta@example.test",
              role: "SUPERUSER",
              isActive: true,
              createdAt: "2026-10-01T12:00:00.000Z",
              updatedAt: "2026-10-20T12:00:00.000Z",
            },
          ],
        }),
      }),
    );

    render(<AdminUsersPage />);

    expect(
      await screen.findByText(
        "Não foi possível carregar os usuários.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Conta Fictícia"),
    ).not.toBeInTheDocument();
  });

  it("trata JSON inválido sem exibir o erro interno", async () => {
    const internalDetail = "erro-interno-ficticio";

    stubUsersResponse(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error(internalDetail);
        },
      }),
    );

    render(<AdminUsersPage />);

    expect(
      await screen.findByText(
        "Não foi possível carregar os usuários.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(internalDetail),
    ).not.toBeInTheDocument();
  });

  it("cancela a consulta pendente ao desmontar a tela", async () => {
    let requestSignal: AbortSignal | undefined;

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string, options?: RequestInit) => {
        if (url === `${apiBase}/auth/me`) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => identity,
          });
        }

        if (url === `${apiBase}/admin/users`) {
          requestSignal = options?.signal ?? undefined;
          return new Promise<never>(() => {});
        }

        return Promise.reject(
          new Error("Requisição inesperada no teste."),
        );
      }),
    );

    const { unmount } = render(<AdminUsersPage />);

    await waitFor(() => {
      expect(requestSignal).toBeDefined();
    });

    expect(requestSignal?.aborted).toBe(false);

    unmount();

    expect(requestSignal?.aborted).toBe(true);
  });
});
