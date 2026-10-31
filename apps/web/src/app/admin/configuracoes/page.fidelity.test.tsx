import { readFileSync } from "node:fs";
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

describe("ADM-11 — fidelidade visual ao Figma", () => {
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

  it("inclui o simbolo Bamak na barra lateral compacta", async () => {
    render(<AdminSettingsPage />);

    await screen.findByRole("heading", {
      name: "Configurações",
    });

    const railBrand = document.querySelector(
      ".bamak-admin-overview__rail-brand",
    );

    expect(railBrand).not.toBeNull();

    expect(
      railBrand?.querySelector("img"),
    ).toHaveAttribute("alt", "Símbolo Bamak");
  });

  it("mantem a introducao compacta conforme o Figma", () => {
    const css = readFileSync(
      "src/app/admin/configuracoes/page.css",
      "utf8",
    );

    expect(css).toMatch(
      /\.bamak-admin-overview--settings\s+\.bamak-admin-overview__intro\s*\{[^}]*gap:\s*6px\s*;/,
    );

    expect(css).toMatch(
      /\.bamak-admin-overview--settings\s+\.bamak-admin-overview__intro\s+h1\s*\{[^}]*font-size:\s*24px\s*;[^}]*line-height:\s*32px\s*;/,
    );
  });
});
