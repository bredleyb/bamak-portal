import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/admin/page.css"),
  "utf8",
);

const overview = readFileSync(
  resolve(
    process.cwd(),
    "src/components/admin/admin-overview.tsx",
  ),
  "utf8",
);

const desktopStyles =
  css.split("@media (min-width: 1200px) {")[1]
    ?.split("@media (min-width: 1441px) {")[0] ?? "";

const wideStyles =
  css.split("@media (min-width: 1441px) {")[1] ?? "";

function extractRule(source: string, selector: string) {
  const escaped = selector.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );

  return (
    source.match(
      new RegExp(`${escaped}\\s*\\{([^}]*)\\}`),
    )?.[1] ?? ""
  );
}

describe("ADM-02 — navegacao e monitores grandes", () => {
  it("preserva breakpoints baseados na largura da viewport", () => {
    const mobileMax = Number(
      css.match(
        /@media \(max-width: (\d+)px\)/g,
      )?.map((rule) =>
        Number(rule.match(/(\d+)px/)?.[1]),
      ).find((width) => width === 767),
    );

    const compactMax = Number(
      css.match(
        /@media \(max-width: (\d+)px\)/g,
      )?.map((rule) =>
        Number(rule.match(/(\d+)px/)?.[1]),
      ).find((width) => width === 1199),
    );

    expect(mobileMax).toBe(767);
    expect(compactMax).toBe(1199);

    for (const width of [382, 385, 390, 669]) {
      expect(width).toBeLessThanOrEqual(mobileMax);
    }

    for (const width of [768, 951, 1024]) {
      expect(width).toBeGreaterThan(mobileMax);
      expect(width).toBeLessThanOrEqual(compactMax);
    }
  });

  it("utiliza o icone Inbox para Atendimentos", () => {
    expect(overview).toMatch(
      /\{\s*label:\s*"Atendimentos",\s*href:\s*null,\s*icon:\s*Inbox\s*\}/,
    );
  });

  it("utiliza o icone FileText para Comunicacao", () => {
    expect(overview).toMatch(
      /\{\s*label:\s*"Comunicação",\s*href:\s*null,\s*icon:\s*FileText\s*\}/,
    );
  });

  it("mantem os icones visiveis na barra lateral desktop", () => {
    expect(desktopStyles).toMatch(
      /\.bamak-admin-overview__sidebar\s+\.bamak-admin-overview__nav-item\s+svg\s*\{[^}]*display:\s*block;/,
    );
  });

  it("expande o painel acima de 1440 px sem centraliza-lo", () => {
    const rule = extractRule(
      wideStyles,
      ".bamak-admin-overview__content",
    );

    expect(rule).toMatch(/max-width:\s*1664px;/);
    expect(rule).toMatch(/margin-inline:\s*0;/);
  });

  it("estende o cabecalho e mantem o perfil alinhado ao painel", () => {
    const header = extractRule(
      wideStyles,
      ".bamak-admin-overview__topbar",
    );

    const account = extractRule(
      wideStyles,
      ".bamak-admin-overview__account",
    );

    expect(header).toMatch(/max-width:\s*none;/);
    expect(header).toMatch(/margin-inline:\s*0;/);

    expect(account).toMatch(
      /margin-right:\s*max\(0px,\s*calc\(100%\s*-\s*1600px\)\);/,
    );
  });
});