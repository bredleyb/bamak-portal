import { render, screen, within } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import AdminPage from "../../app/admin/page";
import AdminSettingsPage from "../../app/admin/configuracoes/page";
import AdminUsersPage from "../../app/admin/configuracoes/usuarios/page";

const replace = vi.hoisted(() => vi.fn());
const apiBase = "http://localhost:3001/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("Hierarquia administrativa e navegação compartilhada", () => {
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

  it("ADM-02: exibe a trilha Administração / Painel", async () => {
    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    const trail = within(
      screen.getByRole("navigation", {
        name: "Trilha administrativa",
      }),
    );

    expect(
      trail.getByText("Administração"),
    ).toBeInTheDocument();

    expect(
      trail.getByText("Painel"),
    ).toHaveAttribute("aria-current", "page");

    expect(
      trail.queryByText("Portal Bamak / Administração"),
    ).not.toBeInTheDocument();
  });

  it("ADM-11: identifica Configurações como página atual", async () => {
    render(<AdminSettingsPage />);

    await screen.findByRole("heading", {
      level: 1,
      name: "Configurações",
    });

    const trail = within(
      screen.getByRole("navigation", {
        name: "Trilha administrativa",
      }),
    );

    expect(
      trail.getByRole("link", {
        name: "Administração",
      }),
    ).toHaveAttribute("href", "/admin");

    expect(
      trail.getByText("Configurações"),
    ).toHaveAttribute("aria-current", "page");
  });

  it("ADM-12: apresenta os três níveis da hierarquia", async () => {
    render(<AdminUsersPage />);

    await screen.findByRole("heading", {
      name: "Usuários e acessos",
    });

    const trail = within(
      screen.getByRole("navigation", {
        name: "Trilha administrativa",
      }),
    );

    expect(
      trail.getByRole("link", {
        name: "Administração",
      }),
    ).toHaveAttribute("href", "/admin");

    expect(
      trail.getByRole("link", {
        name: "Configurações",
      }),
    ).toHaveAttribute(
      "href",
      "/admin/configuracoes",
    );

    expect(
      trail.getByText("Usuários e acessos"),
    ).toHaveAttribute("aria-current", "page");
  });

  it("ADM-12: usa ArrowLeft oficial para retornar à página pai", async () => {
    render(<AdminUsersPage />);

    const heading = await screen.findByRole("heading", {
      name: "Usuários e acessos",
    });

    const back = screen.getByRole("link", {
      name: "Voltar às configurações",
    });

    expect(back).toHaveAttribute(
      "href",
      "/admin/configuracoes",
    );

    const icon = back.querySelector(
      "svg.lucide-arrow-left",
    );

    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute("width", "20");
    expect(icon).toHaveAttribute("height", "20");
    expect(icon).toHaveAttribute("stroke-width", "2");
    expect(icon).toHaveAttribute("aria-hidden", "true");

    const intro = heading.closest(
      ".bamak-admin-overview__intro",
    );

    expect(intro).not.toBeNull();
    expect(intro).toContainElement(back);

    expect(
      within(intro as HTMLElement).getByText("CONFIGURAÇÕES"),
    ).toBeInTheDocument();
  });

  it("ADM-11: não exibe seta de retorno por ser seção principal", async () => {
    render(<AdminSettingsPage />);

    await screen.findByRole("heading", {
      level: 1,
      name: "Configurações",
    });

    expect(
      screen.queryByRole("link", {
        name: "Voltar às configurações",
      }),
    ).not.toBeInTheDocument();
  });

  it("remove o perfil duplicado da barra lateral", async () => {
    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    const sidebar = document.querySelector(
      ".bamak-admin-overview__sidebar",
    );

    expect(sidebar).not.toBeNull();

    expect(
      sidebar?.querySelector(
        ".bamak-admin-overview__sidebar-foot",
      ),
    ).toBeNull();

    expect(
      screen.getByRole("button", {
        name: "Abrir opções da conta",
      }),
    ).toBeInTheDocument();
  });

  it("mantém nomes acessíveis nos links da navegação compacta", async () => {
    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    const navigation = within(
      screen.getByRole("navigation", {
        name: "Navegação administrativa",
      }),
    );

    for (const label of ["Painel", "Configurações"]) {
      const link = navigation.getByRole("link", {
        name: label,
      });

      expect(link).toHaveAttribute("aria-label", label);
      expect(link).toHaveAttribute("title", label);
    }
  });

  it("identifica itens indisponíveis sem expor mensagens técnicas", async () => {
    render(<AdminPage />);

    await screen.findByRole("heading", {
      name: "Visão geral",
    });

    const navigation = within(
      screen.getByRole("navigation", {
        name: "Navegação administrativa",
      }),
    );

    for (const label of ["Atendimentos", "Comunicação"]) {
      const text = navigation.getByText(label);
      const item = text.closest('[aria-disabled="true"]');

      expect(item).not.toBeNull();
      expect(item).toHaveAttribute("title", label);

      expect(item).not.toHaveAttribute("href");
    }
  });
});
