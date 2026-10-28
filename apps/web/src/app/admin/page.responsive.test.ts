import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/admin/page.css"),
  "utf8",
);

const mediumStyles =
  css.split("@media (max-width: 1199px) {")[1]
    ?.split("@media (max-width: 767px) {")[0] ?? "";

describe("ADM-02 — responsividade de laptop e tablet", () => {
  it("preserva a barra lateral de 72 px", () => {
    expect(mediumStyles).toMatch(
      /\.bamak-admin-overview\s*\{[^}]*grid-template-columns:\s*72px minmax\(0,\s*1fr\);/,
    );
  });

  it("utiliza margens horizontais de 24 px", () => {
    expect(mediumStyles).toMatch(
      /\.bamak-admin-overview__content\s*\{[^}]*padding-inline:\s*24px;/,
    );
  });

  it("mantem indicadores em duas colunas com gap de 16 px", () => {
    expect(mediumStyles).toMatch(
      /\.bamak-admin-overview__metric-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);[^}]*gap:\s*16px;/,
    );
  });

  it("empilha entradas e pendencias operacionais", () => {
    expect(mediumStyles).toMatch(
      /\.bamak-admin-overview__sections\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);/,
    );
  });

  it("oculta a segunda acao em laptop e tablet", () => {
    expect(mediumStyles).toMatch(
      /\.bamak-admin-overview__actions button \+ button\s*\{[^}]*display:\s*none;/,
    );
  });
});