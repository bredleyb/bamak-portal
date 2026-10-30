import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const form = readFileSync(
  resolve(
    process.cwd(),
    "src/components/admin/admin-user-create-form.tsx",
  ),
  "utf8",
);

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

const buttonCss = readFileSync(
  resolve(process.cwd(), "src/components/ui/button.css"),
  "utf8",
);

const tokens = readFileSync(
  resolve(process.cwd(), "src/app/globals.css"),
  "utf8",
);

function rule(source: string, selector: string): string {
  const escaped = selector.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );

  const match = source.match(
    new RegExp(`^${escaped}\\s*\\{([^}]*)\\}`, "m"),
  );

  return match?.[1] ?? "";
}

describe("ADM-12 — fidelidade aos componentes oficiais Figma", () => {
  it("preserva o Field oficial com fundo branco e borda cinza", () => {
    const input = rule(fieldCss, ".bamak-field__input");

    expect(tokens).toContain(
      "--semantic-field-border: #767c78;",
    );

    expect(input).toContain(
      "border: 1px solid var(--semantic-field-border);",
    );

    expect(input).toContain(
      "background: var(--semantic-surface-default);",
    );

    expect(input).toContain("height: 44px;");
    expect(input).toContain("border-radius: 8px;");

    expect(css).not.toMatch(
      /\.bamak-admin-users__create-form \.bamak-field__input/,
    );

    expect(
      rule(css, ".bamak-admin-users__create-form"),
    ).not.toContain("--semantic-field-border:");
  });

  it("mantém os estados de foco e erro oficiais do Field", () => {
    const focus = rule(
      fieldCss,
      ".bamak-field__input:focus",
    );

    const error = rule(
      fieldCss,
      '.bamak-field__input[aria-invalid="true"]',
    );

    expect(focus).toContain(
      "border: 2px solid var(--semantic-field-border-focus);",
    );

    expect(error).toContain(
      "border: 2px solid var(--semantic-feedback-danger-content);",
    );

    expect(tokens).toContain(
      "--semantic-field-border-focus: #2e7347;",
    );

    expect(tokens).toContain(
      "--semantic-feedback-danger-content: #963c38;",
    );
  });

  it("utiliza o mesmo padrão oficial no seletor Perfil", () => {
    const selector =
      ".bamak-admin-users__card:last-child .bamak-admin-users__role-trigger";

    const base = rule(css, selector);
    const focus = rule(css, `${selector}:focus-visible`);

    expect(base).toContain(
      "border: 1px solid var(--semantic-field-border);",
    );

    expect(base).toContain(
      "background: var(--semantic-surface-default);",
    );

    expect(base).toContain("height: 44px;");
    expect(base).toContain("border-radius: 8px;");

    expect(base).not.toContain("border-color: transparent;");
    expect(base).not.toContain("box-shadow:");

    expect(focus).toContain(
      "border: 2px solid var(--semantic-field-border-focus);",
    );
  });

  it("preserva o botão primário oficial", () => {
    const selector =
      ".bamak-admin-users__card:last-child .bamak-admin-users__create-submit";

    const primary = rule(css, selector);

    expect(form).toContain(
      'import { Button } from "../ui/button";',
    );

    expect(form).toContain('variant="primary"');
    expect(form).toContain('loading={submitting}');

    expect(primary).toContain(
      "background: var(--semantic-action-primary);",
    );

    expect(primary).toContain("border-radius: 8px;");

    expect(
      rule(buttonCss, ".bamak-button--medium"),
    ).toContain("min-height: 44px;");
  });

  it("utiliza o secundário oficial em Cancelar", () => {
    const selector =
      ".bamak-admin-users__card:last-child .bamak-admin-users__cancel";

    const secondary = rule(css, selector);
    const hover = rule(
      css,
      `${selector}:hover:not(:disabled)`,
    );

    expect(form).toContain('variant="secondary"');

    expect(secondary).toContain(
      "border: 1px solid var(--semantic-action-primary);",
    );

    expect(secondary).toContain(
      "background: var(--semantic-surface-default);",
    );

    expect(secondary).toContain(
      "color: var(--semantic-action-primary);",
    );

    expect(secondary).toContain("box-shadow: none;");

    expect(hover).toContain(
      "background: var(--semantic-action-secondary-background-hover);",
    );
  });

  it("mantém estados de pressão e desabilitação", () => {
    const primary =
      ".bamak-admin-users__card:last-child .bamak-admin-users__create-submit";

    const secondary =
      ".bamak-admin-users__card:last-child .bamak-admin-users__cancel";

    expect(
      rule(css, `${primary}:active:not(:disabled)`),
    ).toContain(
      "background: var(--semantic-action-primary-background-pressed);",
    );

    expect(
      rule(css, `${secondary}:active:not(:disabled)`),
    ).toContain(
      "background: var(--semantic-action-secondary-background-pressed);",
    );

    expect(
      rule(css, `${secondary}:disabled`),
    ).toContain(
      "background: var(--semantic-surface-disabled);",
    );
  });
});
