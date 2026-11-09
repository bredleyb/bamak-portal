import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SiteHeader } from './site-header';

const currentRoute = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => currentRoute.pathname,
}));
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

describe('Issue #94 — navegação compacta', () => {
  it('inclui Início e Política de privacidade no menu', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    const navigation = screen.getByRole('navigation', {
      name: 'Navegação móvel',
    });

    expect(
      within(navigation).getByRole('link', { name: 'Início' }),
    ).toHaveAttribute('href', '/');

    expect(
      within(navigation).getByRole('link', {
        name: 'Política de privacidade',
      }),
    ).toHaveAttribute('href', '/privacidade');
  });
});
describe('Issue #94 — acessibilidade do menu compacto', () => {
  it('identifica o painel como diálogo modal', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Menu de navegação',
    });

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(
      within(dialog).getByRole('navigation', {
        name: 'Navegação móvel',
      }),
    ).toBeInTheDocument();
  });

  it('transfere o foco para Início ao abrir', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    const navigation = screen.getByRole('navigation', {
      name: 'Navegação móvel',
    });

    expect(
      within(navigation).getByRole('link', { name: 'Início' }),
    ).toHaveFocus();
  });

  it('mantém Tab e Shift+Tab dentro do menu', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    const navigation = screen.getByRole('navigation', {
      name: 'Navegação móvel',
    });

    const first = within(navigation).getByRole('link', {
      name: 'Início',
    });

    const last = within(navigation).getByRole('link', {
      name: 'Contato',
    });

    last.focus();
    await user.tab();
    expect(
      screen.getByRole('link', { name: 'Ir para início' }),
    ).toHaveFocus();

    first.focus();
    await user.tab({ shift: true });
    expect(
      screen.getByRole('button', { name: 'Fechar menu' }),
    ).toHaveFocus();
  });
});
describe('Issue #94 — fechamento acessível do diálogo', () => {
  it('mantém o botão Fechar menu dentro do diálogo', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Menu de navegação',
    });

    expect(
      within(dialog).getByRole('button', {
        name: 'Fechar menu',
      }),
    ).toBeInTheDocument();
  });

  it('permite acessar Fechar menu com Shift+Tab a partir de Início', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    expect(
      screen.getByRole('link', { name: 'Início' }),
    ).toHaveFocus();

    await user.tab({ shift: true });

    expect(
      screen.getByRole('button', { name: 'Fechar menu' }),
    ).toHaveFocus();
  });
});
describe('Issue #94 — isolamento modal', () => {
  it('isola conteúdo e rodapé durante o menu e restaura ao fechar', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <>
        <SiteHeader />
        <div className="bamak-site-content">
          <main>Conteúdo público</main>
        </div>
        <footer className="bamak-site-footer">Rodapé</footer>
      </>,
    );

    const content = container.querySelector('.bamak-site-content');
    const footer = container.querySelector('.bamak-site-footer');

    await user.click(
      screen.getByRole('button', { name: 'Abrir menu' }),
    );

    expect(content).toHaveAttribute('inert');
    expect(footer).toHaveAttribute('inert');

    await user.keyboard('{Escape}');

    expect(content).not.toHaveAttribute('inert');
    expect(footer).not.toHaveAttribute('inert');
  });
});
describe('Issue #94 — atalho e rota ativa', () => {
  it('oferece o atalho Ir para conteúdo', () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole('link', { name: 'Ir para conteúdo' }),
    ).toHaveAttribute('href', '#conteudo-principal');
  });

  it('identifica o Catálogo como ativo também em páginas de detalhes', async () => {
    currentRoute.pathname = '/catalogo/produto-exemplo';

    try {
      const user = userEvent.setup();
      render(<SiteHeader />);

      const desktop = screen.getByRole('navigation', {
        name: 'Navegação principal',
      });

      expect(
        within(desktop).getByRole('link', { name: 'Catálogo' }),
      ).toHaveAttribute('aria-current', 'page');

      await user.click(
        screen.getByRole('button', { name: 'Abrir menu' }),
      );

      const mobile = screen.getByRole('navigation', {
        name: 'Navegação móvel',
      });

      expect(
        within(mobile).getByRole('link', { name: 'Catálogo' }),
      ).toHaveAttribute('aria-current', 'page');

      expect(
        within(mobile).getByRole('link', { name: 'Início' }),
      ).not.toHaveAttribute('aria-current');
    } finally {
      currentRoute.pathname = '/';
    }
  });
});