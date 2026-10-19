import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './site-footer';

const companyLinks = [
  { label: 'Institucional', href: '/institucional' },
  { label: 'Aplicações', href: '/aplicacoes' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Cabo Aéreo', href: '/cabo-aereo' },
] as const;

describe('SiteFooter', () => {
  it('renderiza um rodapé semântico', () => {
    render(<SiteFooter />);

    expect(screen.getByRole('contentinfo')).toHaveClass(
      'bamak-site-footer',
    );
  });

  it('utiliza a assinatura branca institucional oficial', () => {
    render(<SiteFooter />);

    const footer = screen.getByRole('contentinfo');
    const home = within(footer).getByRole('link', {
      name: 'Ir para início',
    });

    expect(home).toHaveAttribute('href', '/');

    const logo = within(home).getByRole('img', {
      name: 'Bamak Equipamentos',
    });

    expect(logo.getAttribute('src')).toContain(
      'bamak-lockup-horizontal-white.svg',
    );
  });

  it('exibe a identidade e a localização institucional', () => {
    render(<SiteFooter />);

    expect(
      screen.getByText('Bamak Equipamentos LTDA'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Equipamentos e peças para atividades agrícolas',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Schroeder, Santa Catarina'),
    ).toBeInTheDocument();
  });

  it.each(companyLinks)(
    'oferece o destino $label em Empresa e soluções',
    ({ label, href }) => {
      render(<SiteFooter />);

      const navigation = screen.getByRole('navigation', {
        name: 'Empresa e soluções',
      });

      expect(
        within(navigation).getByRole('link', {
          name: label,
        }),
      ).toHaveAttribute('href', href);
    },
  );

  it('oferece o e-mail institucional para contato', () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole('link', {
        name: 'bamak@bamak.com.br',
      }),
    ).toHaveAttribute(
      'href',
      'mailto:bamak@bamak.com.br',
    );
  });

  it('oferece o telefone institucional para ligação', () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole('link', {
        name: '(47) 3374-1273',
      }),
    ).toHaveAttribute(
      'href',
      'tel:+554733741273',
    );
  });

  it('não associa o telefone ao WhatsApp sem confirmação', () => {
    render(<SiteFooter />);

    const footer = screen.getByRole('contentinfo');

    expect(
      within(footer).getByText('WhatsApp · canal comercial'),
    ).toBeInTheDocument();

    expect(
      footer.querySelector('a[href*="wa.me"]'),
    ).not.toBeInTheDocument();
  });

  it('oferece acesso interno ao atendimento', () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole('link', {
        name: 'Fale com a equipe',
      }),
    ).toHaveAttribute('href', '/contato');
  });

  it('oferece comunicação, FAQ e privacidade', () => {
    render(<SiteFooter />);

    const navigation = screen.getByRole('navigation', {
      name: 'Informações',
    });

    expect(
      within(navigation).getByRole('link', {
        name: 'Comunicação',
      }),
    ).toHaveAttribute('href', '/comunicacao');

    expect(
      within(navigation).getByRole('link', {
        name: 'Perguntas frequentes',
      }),
    ).toHaveAttribute('href', '/faq');

    expect(
      within(navigation).getByRole('link', {
        name: 'Política de privacidade',
      }),
    ).toHaveAttribute(
      'href',
      '/politica-de-privacidade',
    );
  });

  it.each([
    [
      'Facebook da Bamak',
      'https://facebook.com/bamakequipamentos',
    ],
    [
      'Instagram da Bamak',
      'https://instagram.com/bamakequipamentos',
    ],
  ] as const)(
    'oferece o link externo %s de forma segura',
    (label, href) => {
      render(<SiteFooter />);

      const link = screen.getByRole('link', {
        name: label,
      });

      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute(
        'rel',
        expect.stringContaining('noopener'),
      );
      expect(link).toHaveAttribute(
        'rel',
        expect.stringContaining('noreferrer'),
      );
    },
  );

  it('repete o acesso à privacidade na faixa legal', () => {
    render(<SiteFooter />);

    const footer = screen.getByRole('contentinfo');

    const links = within(footer).getAllByRole('link', {
      name: 'Política de privacidade',
    });

    expect(links).toHaveLength(2);

    for (const link of links) {
      expect(link).toHaveAttribute(
        'href',
        '/politica-de-privacidade',
      );
    }
  });

  it('exibe o ano atual nas informações legais', () => {
    render(<SiteFooter />);

    expect(
      screen.getByText(
        `© ${new Date().getFullYear()} Bamak Equipamentos LTDA`,
      ),
    ).toBeInTheDocument();
  });
});
