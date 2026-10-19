import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Field } from './field';

describe('Field', () => {
  it('associa o rótulo ao campo de entrada', () => {
    render(
      <Field
        label="E-mail do solicitante"
        name="email"
        type="email"
      />,
    );

    const input = screen.getByRole('textbox', {
      name: 'E-mail do solicitante',
    });

    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('id');

    const label = screen.getByText('E-mail do solicitante');

    expect(label).toHaveAttribute('for', input.id);
  });

  it('permite digitar no campo', async () => {
    const user = userEvent.setup();

    render(<Field label="Nome" />);

    const input = screen.getByRole('textbox', {
      name: 'Nome',
    });

    await user.type(input, 'Maria Silva');

    expect(input).toHaveValue('Maria Silva');
  });

  it('permite receber foco pelo teclado', async () => {
    const user = userEvent.setup();

    render(<Field label="Assunto" />);

    await user.tab();

    expect(
      screen.getByRole('textbox', { name: 'Assunto' }),
    ).toHaveFocus();
  });

  it('preserva o valor em modo somente leitura', () => {
    render(
      <Field
        label="Protocolo"
        defaultValue="BAM-001"
        readOnly
      />,
    );

    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('BAM-001');
    expect(input).toHaveAttribute('readonly');
  });

  it('associa uma mensagem de ajuda ao campo', () => {
    render(
      <Field
        label="E-mail"
        hint="Utilize seu endereço profissional."
      />,
    );

    const input = screen.getByRole('textbox');
    const hint = screen.getByText(
      'Utilize seu endereço profissional.',
    );

    expect(hint).toHaveAttribute('id');
    expect(input).toHaveAttribute(
      'aria-describedby',
      hint.id,
    );
  });

  it('assinala erro e associa sua mensagem ao campo', () => {
    render(
      <Field
        label="E-mail"
        error="Informe um e-mail válido."
      />,
    );

    const input = screen.getByRole('textbox');
    const error = screen.getByText('Informe um e-mail válido.');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(error).toHaveAttribute('id');
    expect(input).toHaveAttribute(
      'aria-describedby',
      error.id,
    );
  });

  it('preserva ajuda e erro na descrição acessível', () => {
    render(
      <Field
        label="E-mail"
        hint="Informe um endereço para contato."
        error="O endereço informado é inválido."
      />,
    );

    const input = screen.getByRole('textbox');
    const hint = screen.getByText(
      'Informe um endereço para contato.',
    );
    const error = screen.getByText(
      'O endereço informado é inválido.',
    );

    const describedBy = (
      input.getAttribute('aria-describedby') ?? ''
    ).split(' ');

    expect(describedBy).toContain(hint.id);
    expect(describedBy).toContain(error.id);
  });

  it('permite indicar um campo obrigatório', () => {
    render(<Field label="Nome completo" required />);

    expect(
      screen.getByRole('textbox', {
        name: 'Nome completo',
      }),
    ).toBeRequired();
  });

  it('permite definir explicitamente o identificador', () => {
    render(<Field id="telefone" label="Telefone" />);

    expect(
      screen.getByRole('textbox', { name: 'Telefone' }),
    ).toHaveAttribute('id', 'telefone');
  });
});
