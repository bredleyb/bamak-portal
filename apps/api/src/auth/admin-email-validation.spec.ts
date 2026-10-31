import { isValidAdminEmail } from './admin-email-validation';

describe('Validacao de e-mail administrativo na API', () => {
  it.each([
    ['admin@example.invalid', true],
    [' CONTATO+TESTE@sub.example.invalid ', true],
    ['a@b.c', true],
    ['nome@dominio.com.br', true],
    ['', false],
    ['email-invalido', false],
    ['@dominio.com', false],
    ['nome@.com', false],
    ['nome@dominio.', false],
    ['nome@@dominio.com', false],
    ['nome@domi nio.com', false],
    ['nome@dominio.com@outro', false],
  ])('valida %j como %j', (email, esperado) => {
    expect(isValidAdminEmail(email)).toBe(esperado);
  });

  it('rejeita uma entrada extensa com separadores repetidos', () => {
    const email = `nome@dominio.${'a.'.repeat(3000)}@`;

    expect(isValidAdminEmail(email)).toBe(false);
  });
});