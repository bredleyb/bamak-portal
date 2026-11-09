import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SiteLayout from './layout';

vi.mock('../../components/layout/site-header', () => ({
  SiteHeader: () => <header>Cabeçalho de teste</header>,
}));

vi.mock('../../components/layout/site-footer', () => ({
  SiteFooter: () => <footer>Rodapé de teste</footer>,
}));

describe('Issue #94 — destino do atalho', () => {
  it('fornece um alvo focável contendo o conteúdo principal', () => {
    render(
      <SiteLayout>
        <main>Conteúdo de teste</main>
      </SiteLayout>,
    );

    const target = document.getElementById('conteudo-principal');

    expect(target).toBeInTheDocument();
    expect(target).toHaveAttribute('tabindex', '-1');
    expect(target).toContainElement(screen.getByRole('main'));
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });
});