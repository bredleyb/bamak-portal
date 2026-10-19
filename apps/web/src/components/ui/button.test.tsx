import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renderiza um botão semântico com variante e tamanho padrão', () => {
    render(<Button>Consultar catálogo</Button>);

    const button = screen.getByRole('button', {
      name: 'Consultar catálogo',
    });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass(
      'bamak-button--primary',
      'bamak-button--small',
    );
  });

  it.each(['primary', 'secondary', 'ghost'] as const)(
    'suporta a variante %s',
    (variant) => {
      render(<Button variant={variant}>Continuar</Button>);

      expect(screen.getByRole('button')).toHaveClass(
        `bamak-button--${variant}`,
      );
    },
  );

  it('suporta o tamanho médio', () => {
    render(<Button size="medium">Continuar</Button>);

    expect(screen.getByRole('button')).toHaveClass(
      'bamak-button--medium',
    );
  });

  it('executa a ação ao receber um clique', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Continuar</Button>);
    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('impede interação quando está desabilitado', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={onClick}>
        Continuar
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('impede duplicação da ação durante o carregamento', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button
        variant="secondary"
        size="medium"
        loading
        onClick={onClick}
      >
        Enviar solicitação
      </Button>,
    );

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveClass('bamak-button--loading');

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('mantém a variante primária durante o carregamento', () => {
    render(
      <Button variant="primary" size="medium" loading>
        Processando
      </Button>,
    );

    const button = screen.getByRole('button');

    expect(button).toHaveClass(
      'bamak-button--primary',
      'bamak-button--loading',
    );
    expect(button).toBeDisabled();
  });
  it('permite o uso explícito como botão de envio', () => {
    render(<Button type="submit">Enviar</Button>);

    expect(screen.getByRole('button')).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
