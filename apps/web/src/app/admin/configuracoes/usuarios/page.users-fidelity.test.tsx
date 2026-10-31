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

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

const apiBase = "http://localhost:3001/api";

const users = [
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
];

function findUserRow(name: string): HTMLElement {
  const row = screen.getByText(name).closest("li");

  if (!row) {
    throw new Error("Linha da conta não encontrada.");
  }

  return row;
}

describe("ADM-12 — fidelidade da listagem ao Figma", () => {
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
            json: async () => ({ users }),
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

  it("exibe a última alteração de cada conta em formato brasileiro", async () => {
    render(<AdminUsersPage />);

    await screen.findByText("Ana Exemplo");

    const ana = within(findUserRow("Ana Exemplo"));
    const bruno = within(findUserRow("Bruno Exemplo"));

    expect(
      ana.getByText(/Última alteração: 20\/10\/2026/),
    ).toBeInTheDocument();

    expect(
      bruno.getByText(/Última alteração: 21\/10\/2026/),
    ).toBeInTheDocument();
  });

  it("preserva perfil e situação associados à conta correta", async () => {
    render(<AdminUsersPage />);

    await screen.findByText("Ana Exemplo");

    const ana = within(findUserRow("Ana Exemplo"));
    const bruno = within(findUserRow("Bruno Exemplo"));

    expect(
      ana.getByText("Administrador"),
    ).toBeInTheDocument();

    expect(
      ana.getByText("Ativo"),
    ).toBeInTheDocument();

    expect(
      bruno.getByText("Operador"),
    ).toBeInTheDocument();

    expect(
      bruno.getByText("Inativo"),
    ).toBeInTheDocument();
  });
});
