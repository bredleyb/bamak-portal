import { describe, expect, it } from "vitest";
import { isValidAdminEmail } from "./admin-email-validation";

describe("Validação de e-mail administrativo", () => {
  it.each([
    ["admin@example.invalid", true],
    [" contato+teste@sub.example.invalid ", true],
    ["a@b.c", true],
    ["nome@dominio.com.br", true],
    ["", false],
    ["email-invalido", false],
    ["@dominio.com", false],
    ["nome@.com", false],
    ["nome@dominio.", false],
    ["nome@@dominio.com", false],
    ["nome@domi nio.com", false],
    ["nome@dominio.com@outro", false],
  ])("valida %j como %j", (email, esperado) => {
    expect(isValidAdminEmail(email)).toBe(esperado);
  });

  it("rejeita entrada extensa com separadores repetidos", () => {
    const email = `nome@dominio.${"a.".repeat(3000)}@`;

    expect(isValidAdminEmail(email)).toBe(false);
  });
});