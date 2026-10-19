import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renderiza um checkbox nativo inicialmente desmarcado', () => {
    render(
      <Checkbox
        label="Li e concordo com os termos."
        name="consentimento"
        value="sim"
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Li e concordo com os termos.',
    });

    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).toHaveAttribute('name', 'consentimento');
    expect(checkbox).toHaveAttribute('value', 'sim');
    expect(checkbox).not.toBeChecked();
  });

  it('associa o rótulo ao controle', () => {
    render(<Checkbox label="Aceito os termos" />);

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Aceito os termos');

    expect(checkbox.id).toBeTruthy();
    expect(label).toHaveAttribute('for', checkbox.id);
  });

  it('permite marcar ao clicar no rótulo', async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Concordo com os termos" />);

    await user.click(screen.getByText('Concordo com os termos'));

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('permite desmarcar novamente', async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Receber comunicações" />);

    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('permite foco por Tab e alternância com Espaço', async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Concordo com os termos" />);

    const checkbox = screen.getByRole('checkbox');

    await user.tab();
    expect(checkbox).toHaveFocus();

    await user.keyboard(' ');
    expect(checkbox).toBeChecked();
  });

  it('permite controlar o estado externamente', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Checkbox
        label="Consentimento"
        checked={false}
        onChange={onChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(onChange).toHaveBeenCalledOnce();
  });

  it('suporta marcação obrigatória', () => {
    render(
      <Checkbox
        label="Concordo com a política de privacidade"
        required
      />,
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeRequired();
    expect(checkbox).not.toBeChecked();
  });

  it('impede interação quando desabilitado', async () => {
    const user = userEvent.setup();

    render(
      <Checkbox label="Opção indisponível" disabled />,
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it('associa a mensagem de erro ao controle', () => {
    render(
      <Checkbox
        label="Consentimento"
        error="É necessário aceitar para continuar."
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    const error = screen.getByText(
      'É necessário aceitar para continuar.',
    );

    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(error).toHaveAttribute('id');
    expect(error).toHaveAttribute('role', 'alert');
    expect(checkbox).toHaveAttribute(
      'aria-describedby',
      error.id,
    );
  });

  it('associa mensagens de ajuda e erro simultaneamente', () => {
    render(
      <Checkbox
        label="Consentimento"
        hint="Leia a política antes de continuar."
        error="Confirme seu consentimento."
      />,
    );

    const checkbox = screen.getByRole('checkbox');

    const hint = screen.getByText(
      'Leia a política antes de continuar.',
    );

    const error = screen.getByText(
      'Confirme seu consentimento.',
    );

    const describedBy = (
      checkbox.getAttribute('aria-describedby') ?? ''
    ).split(' ');

    expect(describedBy).toContain(hint.id);
    expect(describedBy).toContain(error.id);
  });

  it('permite definir um identificador explícito', () => {
    render(
      <Checkbox
        id="aceite-lgpd"
        label="Concordo com o tratamento de dados"
      />,
    );

    expect(
      screen.getByRole('checkbox'),
    ).toHaveAttribute('id', 'aceite-lgpd');
  });

  it('gera identificadores diferentes para múltiplos controles', () => {
    render(
      <>
        <Checkbox label="Consentimento obrigatório" />
        <Checkbox label="Comunicações opcionais" />
      </>,
    );

    const first = screen.getByRole('checkbox', {
      name: 'Consentimento obrigatório',
    });

    const second = screen.getByRole('checkbox', {
      name: 'Comunicações opcionais',
    });

    expect(first.id).toBeTruthy();
    expect(second.id).toBeTruthy();
    expect(first.id).not.toBe(second.id);
  });
});
