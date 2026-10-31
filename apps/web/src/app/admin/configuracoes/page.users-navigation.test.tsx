import { render, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import AdminSettingsPage from "./page";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("ADM-12 — acesso a gestão de usuários", () => {
  beforeEach(() => {
    replace.mockReset();

    vi.stubEnv(
      "NEXT_PUBLIC_API_URL",
      "http://localhost:3001/api",
    );

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          userId: "00000000-0000-4000-8000-000000000001",
          role: "ADMINISTRATOR",
        }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("oferece navegação para usuários a partir de Configurações", async () => {
    render(<AdminSettingsPage />);

    await screen.findByRole("heading", {
      name: "Configurações",
    });

    const link = screen.queryByRole("link", {
      name: "Gerenciar usuários",
    });

    expect(link).not.toBeNull();
    expect(link).toHaveAttribute(
      "href",
      "/admin/configuracoes/usuarios",
    );
  });
});
