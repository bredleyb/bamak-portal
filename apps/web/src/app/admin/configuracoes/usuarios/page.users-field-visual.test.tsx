import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const fieldCss = readFileSync(
  resolve(process.cwd(), "src/components/ui/field.css"),
  "utf8",
);

describe("ADM-12 — fidelidade visual de Field e Select", () => {
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

  it("reproduz altura, raio e borda do Field do Figma", () => {
    const rule =
      fieldCss.match(
        /\.bamak-field__input\s*\{([^}]*)\}/,
      )?.[1] ?? "";

    expect(rule).toMatch(/(?:min-)?height:\s*44px\s*;/);
    expect(rule).toMatch(/border-radius:\s*8px\s*;/);
    expect(rule).toMatch(
      /border:\s*1px solid var\(--semantic-field-border\)\s*;/,
    );
    expect(rule).toMatch(/font-size:\s*16px\s*;/);
  });

  it("usa o foco do Figma sem acumular outline global", () => {
    const rule =
      fieldCss.match(
        /\.bamak-field__input:focus\s*\{([^}]*)\}/,
      )?.[1] ?? "";

    const focusVisible =
      fieldCss.match(
        /\.bamak-field__input:focus-visible\s*\{([^}]*)\}/,
      )?.[1] ?? "";

    expect(rule).toMatch(
      /border:\s*2px solid var\(--semantic-field-border-focus\)\s*;/,
    );

    expect(focusVisible).toMatch(/outline:\s*none\s*;/);
  });

  it("estiliza o seletor personalizado com os tokens do Figma", () => {
    const rule =
      css.match(
        /\.bamak-admin-users__card:last-child \.bamak-admin-users__role-trigger\s*\{([^}]*)\}/,
      )?.[1] ?? "";

    expect(rule).toMatch(/height:\s*44px\s*;/);
    expect(rule).toMatch(/border-radius:\s*8px\s*;/);
    expect(rule).toMatch(
      /border:\s*1px solid var\(--semantic-field-border\)\s*;/,
    );
  });

  it("utiliza ChevronDown oficial e preserva o select acessível", async () => {
    const user = userEvent.setup();
    render(<AdminUsersPage />);

    await user.click(
      await screen.findByRole("button", {
        name: "Adicionar usuário",
      }),
    );

    const form = screen.getByRole("form", {
      name: "Novo usuário",
    });

    const role = within(form).getByRole("combobox", {
      name: "Perfil",
    });

    expect(role).toHaveAttribute("aria-haspopup", "listbox");

    const wrapper = role.closest(
      ".bamak-admin-users__select-wrap",
    );

    expect(wrapper).not.toBeNull();

    const icon = wrapper?.querySelector(
      "svg.lucide-chevron-down",
    );

    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute("width", "20");
    expect(icon).toHaveAttribute("height", "20");
    expect(icon).toHaveAttribute("stroke-width", "2");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
