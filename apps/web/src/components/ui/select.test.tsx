import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Select } from './select';

const categories = [
  { value: 'equipamentos', label: 'Equipamentos' },
  { value: 'pecas', label: 'Peças' },
];

describe('Select', () => {
  it('associa o rótulo ao controle nativo', () => {
    render(
      <Select
        label="Categoria"
        name="categoria"
        options={categories}
      />,
    );

    const select = screen.getByRole('combobox', {
      name: 'Categoria',
    });

    expect(select).toHaveAttribute('name', 'categoria');
    expect(select).toHaveAttribute('id');

    expect(screen.getByText('Categoria')).toHaveAttribute(
      'for',
      select.id,
    );
  });

  it('exibe uma opção inicial sem valor selecionado', () => {
    render(
      <Select label="Categoria" options={categories} />,
    );

    const select = screen.getByRole('combobox');

    expect(select).toHaveValue('');
    expect(
      screen.getByRole('option', {
        name: 'Selecione uma opção',
      }),
    ).toHaveValue('');
  });

  it('renderiza as opções disponíveis', () => {
    render(
      <Select label="Categoria" options={categories} />,
    );

    expect(
      screen.getByRole('option', { name: 'Equipamentos' }),
    ).toHaveValue('equipamentos');

    expect(
      screen.getByRole('option', { name: 'Peças' }),
    ).toHaveValue('pecas');
  });

  it('permite selecionar uma opção', async () => {
    const user = userEvent.setup();

    render(
      <Select label="Categoria" options={categories} />,
    );

    const select = screen.getByRole('combobox');

    await user.selectOptions(select, 'pecas');

    expect(select).toHaveValue('pecas');
  });

  it('permite receber foco pelo teclado', async () => {
    const user = userEvent.setup();

    render(
      <Select label="Categoria" options={categories} />,
    );

    await user.tab();

    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('suporta campos obrigatórios', () => {
    render(
      <Select
        label="Categoria"
        options={categories}
        required
      />,
    );

    expect(screen.getByRole('combobox')).toBeRequired();
  });

  it('impede interação quando desabilitado', () => {
    render(
      <Select
        label="Categoria"
        options={categories}
        disabled
      />,
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('associa a mensagem de erro ao controle', () => {
    render(
      <Select
        label="Categoria"
        options={categories}
        error="Selecione uma categoria."
      />,
    );

    const select = screen.getByRole('combobox');
    const error = screen.getByText(
      'Selecione uma categoria.',
    );

    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(error).toHaveAttribute('id');
    expect(select).toHaveAttribute(
      'aria-describedby',
      error.id,
    );
  });

  it('preserva ajuda e erro na descrição acessível', () => {
    render(
      <Select
        label="Categoria"
        options={categories}
        hint="Escolha uma categoria de produto."
        error="Selecione uma categoria."
      />,
    );

    const select = screen.getByRole('combobox');
    const hint = screen.getByText(
      'Escolha uma categoria de produto.',
    );
    const error = screen.getByText(
      'Selecione uma categoria.',
    );

    const describedBy = (
      select.getAttribute('aria-describedby') ?? ''
    ).split(' ');

    expect(describedBy).toContain(hint.id);
    expect(describedBy).toContain(error.id);
  });

  it('utiliza o ícone ChevronDown da biblioteca Lucide', () => {
    const { container } = render(
      <Select label="Categoria" options={categories} />,
    );

    const icon = container.querySelector(
      '.bamak-select__chevron svg.lucide-chevron-down',
    );

    expect(icon).toBeInTheDocument();
    expect(icon?.closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('respeita opções individuais desabilitadas', () => {
    render(
      <Select
        label="Categoria"
        options={[
          ...categories,
          {
            value: 'indisponivel',
            label: 'Indisponível',
            disabled: true,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole('option', {
        name: 'Indisponível',
      }),
    ).toBeDisabled();
  });
  it('gera identificadores diferentes para múltiplos controles', () => {
    render(
      <>
        <Select label="Categoria principal" options={categories} />
        <Select label="Categoria secundária" options={categories} />
      </>,
    );

    const first = screen.getByRole('combobox', {
      name: 'Categoria principal',
    });
    const second = screen.getByRole('combobox', {
      name: 'Categoria secundária',
    });

    expect(first.id).toBeTruthy();
    expect(second.id).toBeTruthy();
    expect(first.id).not.toBe(second.id);
  });
});
