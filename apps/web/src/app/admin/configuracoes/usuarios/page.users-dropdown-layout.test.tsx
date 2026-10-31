import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(
    process.cwd(),
    "src/app/admin/configuracoes/usuarios/page.css",
  ),
  "utf8",
);

describe("ADM-12 — posicionamento do menu de Perfil", () => {
  it("mantém a lista no fluxo do formulário", () => {
    const rule = css.match(
      /\.bamak-admin-users__role-listbox\s*\{([^}]*)\}/,
    )?.[1] ?? "";

    expect(rule).toMatch(/position:\s*static\s*;/);
    expect(rule).toMatch(/width:\s*100%\s*;/);
    expect(rule).toMatch(/margin:\s*4px 0 0\s*;/);
    expect(rule).not.toMatch(/position:\s*absolute\s*;/);
  });
});
