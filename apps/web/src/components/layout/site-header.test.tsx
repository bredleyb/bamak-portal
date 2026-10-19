import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './site-header';

const destinations = [
  { label: 'Institucional', href: '/institucional' },
  { label: 'Aplicações', href: '/aplicacoes' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Cabo Aéreo', href: '/cabo-aereo' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Comunicação', href: '/comunicacao' },
] as const;

describe('SiteHeader', () => {
  it('renderiza um cabeçalho semântico', () => {
    render(<SiteHeader />);

    expect(screen.getByRole('banner')).toHaveClass(
      'bamak-site-header',
    );
  });

  it('utiliza a assinatura institucional oficial como link inicial', () => {
    render(<SiteHeader />);

    const home = screen.getByRole('link', {
      name: 'Ir para início',
    });

    expect(home).toHaveAttribute('href', '/');

    const logo = within(home).getByRole('img', {
      name: 'Bamak Equipamentos',
    });

    expect(logo.getAttribute('src')).toContain(
      'bamak-lockup-horizontal-green.svg',
    );
  });

  it('oferece os seis destinos da navegação principal', () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole('navigation', {
      name: 'Navegação principal',
    });

    expect(within(navigation).getAllByRole('link')).toHaveLength(
      6,
    );

    for (const destination of destinations) {
      expect(
        within(navigation).getByRole('link', {
          name: destination.label,
        }),
      ).toHaveAttribute('href', destination.href);
    }
  });

  it('oferece Contato como ação institucional', () => {
    render(<SiteHeader />);

    const contact = screen.getByRole('link', {
      name: 'Contato',
    });

    expect(contact).toHaveAttribute('href', '/contato');
    expect(contact).toHaveClass('bamak-site-header__contact');
  });

  it('mantém o menu compacto fechado inicialmente', () => {
    render(<SiteHeader />);

    const button = screen.getByRole('button', {
      name: 'Abrir menu',
    });

    expect(button).toHaveAttribute('aria-expanded', 'false');

    expect(
      screen.queryByRole('navigation', {
        name: 'Navegação móvel',
      }),
    ).not.toBeInTheDocument();
  });

  it('abre o menu e expõe todos os destinos no painel', async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    const button = screen.getByRole('button', {
      name: 'Fechar menu',
    });

    const navigation = screen.getByRole('navigation', {
      name: 'Navegação móvel',
    });

    expect(button).toHaveAttribute('aria-expanded', 'true');

    expect(navigation).toHaveAttribute(
      'id',
      button.getAttribute('aria-controls'),
    );

    for (const destination of destinations) {
      expect(
        within(navigation).getByRole('link', {
          name: destination.label,
        }),
      ).toHaveAttribute('href', destination.href);
    }

    expect(
      within(navigation).getByRole('link', {
        name: 'Contato',
      }),
    ).toHaveAttribute('href', '/contato');
  });

  it('fecha o menu ao ativar novamente o botão', async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    await user.click(
      screen.getByRole('button', { name: 'Fechar menu' }),
    );

    expect(
      screen.getByRole('button', { name: 'Abrir menu' }),
    ).toHaveAttribute('aria-expanded', 'false');

    expect(
      screen.queryByRole('navigation', {
        name: 'Navegação móvel',
      }),
    ).not.toBeInTheDocument();
  });

  it('fecha o menu com Escape e devolve o foco ao botão', async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    await user.keyboard('{Escape}');

    const button = screen.getByRole('button', {
      name: 'Abrir menu',
    });

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-expanded', 'false');

    expect(
      screen.queryByRole('navigation', {
        name: 'Navegação móvel',
      }),
    ).not.toBeInTheDocument();
  });

  it('permite abrir o menu pelo teclado', async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    const button = screen.getByRole('button', {
      name: 'Abrir menu',
    });

    button.focus();

    await user.keyboard('{Enter}');

    expect(
      screen.getByRole('button', { name: 'Fechar menu' }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('fecha o menu ao selecionar um destino', async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    const navigation = screen.getByRole('navigation', {
      name: 'Navegação móvel',
    });

    await user.click(
      within(navigation).getByRole('link', {
        name: 'Aplicações',
      }),
    );

    expect(
      screen.queryByRole('navigation', {
        name: 'Navegação móvel',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Abrir menu',
      }),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('fecha o menu ao selecionar a marca Bamak', async () => {
    const user = userEvent.setup();

    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    await user.click(
      screen.getByRole('link', {
        name: 'Ir para início',
      }),
    );

    expect(
      screen.queryByRole('navigation', {
        name: 'Navegação móvel',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Abrir menu',
      }),
    ).toHaveAttribute('aria-expanded', 'false');
  });
  it('utiliza o ícone oficial Menu da biblioteca Lucide', () => {
    const { container } = render(<SiteHeader />);

    const icon = container.querySelector(
      '.bamak-site-header__menu-button svg.lucide-menu',
    );

    expect(icon).toBeInTheDocument();

    expect(
      icon?.closest('[aria-hidden="true"]'),
    ).toBeInTheDocument();
  });
});
