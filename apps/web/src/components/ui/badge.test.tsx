import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  it('aplica o estado neutro por padrão', () => {
    render(<Badge label="Rascunho" />);

    expect(screen.getByText('Rascunho')).toHaveClass(
      'bamak-badge',
      'bamak-badge--neutral',
    );
  });

  it.each([
    ['neutral', 'Rascunho'],
    ['new', 'Novo'],
    ['in-review', 'Em análise'],
    ['done', 'Concluído'],
  ] as const)(
    'exibe o estado %s com o rótulo informado',
    (status, label) => {
      render(<Badge status={status} label={label} />);

      const badge = screen.getByText(label);

      expect(badge).toHaveClass(
        'bamak-badge',
        `bamak-badge--${status}`,
      );

      expect(badge).toHaveTextContent(label);
    },
  );

  it('permite adicionar classes sem perder as classes internas', () => {
    render(
      <Badge
        label="Novo"
        status="new"
        className="status-personalizado"
      />,
    );

    expect(screen.getByText('Novo')).toHaveClass(
      'bamak-badge',
      'bamak-badge--new',
      'status-personalizado',
    );
  });

  it('usa semântica informativa sem criar alertas automáticos', () => {
    render(<Badge label="Em análise" status="in-review" />);

    const badge = screen.getByText('Em análise');

    expect(badge.tagName).toBe('SPAN');
    expect(badge).not.toHaveAttribute('role', 'alert');
    expect(badge).not.toHaveAttribute('aria-live');
  });

  it('preserva integralmente rótulos extensos', () => {
    const label = 'Aguardando análise da documentação enviada';

    render(<Badge label={label} status="in-review" />);

    expect(screen.getByText(label)).toHaveTextContent(label);
  });

  it('permite múltiplos estados na mesma interface', () => {
    render(
      <>
        <Badge label="Rascunho" status="neutral" />
        <Badge label="Novo" status="new" />
        <Badge label="Em análise" status="in-review" />
        <Badge label="Concluído" status="done" />
      </>,
    );

    expect(screen.getByText('Rascunho')).toHaveClass(
      'bamak-badge--neutral',
    );

    expect(screen.getByText('Novo')).toHaveClass(
      'bamak-badge--new',
    );

    expect(screen.getByText('Em análise')).toHaveClass(
      'bamak-badge--in-review',
    );

    expect(screen.getByText('Concluído')).toHaveClass(
      'bamak-badge--done',
    );
  });
});
