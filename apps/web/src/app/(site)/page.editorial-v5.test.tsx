import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';
import { SiteFooter } from '../../components/layout/site-footer';

// Contratos editoriais da v5 mantidos e atualizados conforme a Home UX v7.
describe('PUB-01 — conteúdo editorial da Home UX v7', () => {
  it('apresenta a atuação industrial e agrícola no hero', () => {
    render(<Home />);
    expect(screen.getByRole('heading', {
      level: 1,
      name: /Máquinas e equipamentos para a\sindústria e o\sagronegócio/,
    })).toBeInTheDocument();
    expect(screen.getByText(/setores metalúrgico, alimentício, têxtil e agrícola/))
      .toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Conhecer aplicações' }))
      .toHaveAttribute('href', '/aplicacoes');
  });

  it('explica aplicações diversas e diferencia o catálogo', () => {
    render(<Home />);
    const paths = screen.getByRole('region', { name: 'Explore as soluções' });
    const app = within(paths).getByRole('heading', { name: 'Aplicações' }).closest('article');
    const catalog = within(paths).getByRole('heading', { name: 'Catálogo' }).closest('article');
    expect(app).not.toBeNull();
    expect(catalog).not.toBeNull();
    expect(within(app!).getByText(/processos industriais/)).toBeInTheDocument();
    expect(within(catalog!).getByText(/Consulte máquinas, equipamentos, peças e acessórios/))
      .toBeInTheDocument();
    expect(within(app!).getByRole('link', { name: 'Explorar aplicações' }))
      .toHaveAttribute('href', '/aplicacoes');
    expect(within(catalog!).getByRole('link', { name: 'Consultar catálogo' }))
      .toHaveAttribute('href', '/catalogo');
  });

  it('explica o Cabo Aéreo dentro da exploração e preserva seu encaminhamento', () => {
    render(<Home />);
    const section = screen.getByRole('region', { name: 'Explore as soluções' });
    expect(within(section).getByText(/Em lavouras de banana, o Cabo Aéreo permite transportar cachos/))
      .toBeInTheDocument();
    expect(within(section).getByRole('link', { name: 'Conhecer o Cabo Aéreo e solicitar análise' }))
      .toHaveAttribute('href', '/cabo-aereo');
  });

  it('inclui a trajetória da empresa e orienta o contato', () => {
    render(<Home />);
    expect(screen.getByText(/surgiu em 1988, em Guaramirim \(SC\)/))
      .toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Conhecer nossa história' }))
      .toHaveAttribute('href', '/institucional');
    expect(screen.getByText(/Precisa de informações sobre uma máquina/))
      .toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entrar em contato' }))
      .toHaveAttribute('href', '/contato');
  });

  it('preserva os três placeholders explícitos enquanto faltam fotografias autorizadas', () => {
    const { container } = render(<Home />);
    const images = container.querySelectorAll('.bamak-home__reserved img');
    expect(images).toHaveLength(3);
    for (const image of images) {
      expect(image.getAttribute('src')).toContain('imagem-reservada-wide.svg');
      expect(image.getAttribute('alt')).toBe('');
    }
    expect(screen.getByText('Fachada da empresa')).toBeInTheDocument();
  });
});

describe('rodapé público — assinatura editorial', () => {
  it('inclui indústria, energia e agronegócio', () => {
    render(<SiteFooter />);
    expect(screen.getByText('Máquinas e equipamentos para a indústria, energia e agronegócio.'))
      .toBeInTheDocument();
    expect(screen.getByText('WhatsApp comercial')).toBeInTheDocument();
  });
});
