import { render, screen, within } from "@testing-library/react";
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

function accountRow(name: string): HTMLElement {
  const row = screen.getByText(name).closest("li");

  if (!row) {
    throw new Error("Linha de usuário não encontrada.");
  }

  return row;
}

describe("ADM-12 — ações individuais das contas", () => {
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

  it("apresenta Revisar permissões por conta sem habilitar a operação", async () => {
    render(<AdminUsersPage />);

    await screen.findByText("Ana Exemplo");

    for (const name of ["Ana Exemplo", "Bruno Exemplo"]) {
      const row = within(accountRow(name));

      const action = row.queryByRole("button", {
        name: "Revisar permissões",
      });

      expect(action).not.toBeNull();
      expect(action).toBeDisabled();
    }
  });

  it("preserva metadados e data sem misturar contas", async () => {
    render(<AdminUsersPage />);

    await screen.findByText("Ana Exemplo");

    const ana = within(accountRow("Ana Exemplo"));
    const bruno = within(accountRow("Bruno Exemplo"));

    expect(ana.getByText("Administrador")).toBeInTheDocument();
    expect(ana.getByText("Ativo")).toBeInTheDocument();

    expect(
      ana.getByText(/Última alteração: 20\/10\/2026/),
    ).toHaveAttribute(
      "datetime",
      "2026-10-20T12:00:00.000Z",
    );

    expect(bruno.getByText("Operador")).toBeInTheDocument();
    expect(bruno.getByText("Inativo")).toBeInTheDocument();

    expect(
      bruno.getByText(/Última alteração: 21\/10\/2026/),
    ).toHaveAttribute(
      "datetime",
      "2026-10-21T12:00:00.000Z",
    );
  });
});
