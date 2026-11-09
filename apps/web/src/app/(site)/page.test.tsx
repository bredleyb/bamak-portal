import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('PUB-01 — Home pública', () => {
  it('apresenta a Bamak com um único H1 descritivo', () => {
    render(<Home />);

    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Máquinas e equipamentos para a\sindústria e o\sagronegócio/,
      }),
    ).toBeInTheDocument();
  });

  it('preserva grupos de palavras inseparáveis do Figma nas três seções', () => {
    render(<Home />);

    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo.textContent).toContain('a\u00a0indústria');
    expect(titulo.textContent).toContain('o\u00a0agronegócio');
    expect(screen.getByText(/A Bamak Equipamentos surgiu em 1988/).textContent)
      .toContain('Guaramirim\u00a0(SC)');
    expect(screen.getByText(/A Bamak Equipamentos surgiu em 1988/).textContent)
      .toContain('máquinas\u00a0e\u00a0equipamentos');
    expect(screen.getByText(/Precisa de informações sobre uma máquina/).textContent)
      .toContain('Descreva\u00a0sua\u00a0necessidade');
  });

  it('apresenta a sede e a atuação institucional documentadas', () => {
    render(<Home />);

    expect(screen.getByText(/Com sede em Schroeder \(SC\)/)).toBeInTheDocument();
    expect(screen.getByText(/desenvolve e fabrica equipamentos/))
      .toBeInTheDocument();
  });

  it('oferece os cinco destinos editoriais previstos', () => {
    render(<Home />);

    const hrefs = screen.getAllByRole('link')
      .map((link) => link.getAttribute('href'));

    for (const href of [
      '/aplicacoes',
      '/catalogo',
      '/cabo-aereo',
      '/institucional',
      '/contato',
    ]) {
      expect(hrefs).toContain(href);
    }
  });

  it('organiza os destaques editoriais da página', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { name: 'Cabo Aéreo' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Nossa trajetória' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Fale com a Bamak' }),
    ).toBeInTheDocument();
  });

  it('oferece contato principal e FAQ secundário na seção final', () => {
    render(<Home />);

    const contato = screen.getByRole('region', { name: 'Fale com a Bamak' });
    expect(within(contato).getByRole('link', { name: 'Entrar em contato' }))
      .toHaveAttribute('href', '/contato');
    expect(within(contato).getByRole('link', { name: 'Consultar perguntas frequentes' }))
      .toHaveAttribute('href', '/faq');
    expect(within(contato).getByText('ou'))
      .toHaveAttribute('aria-hidden', 'true');
    expect(within(contato).getAllByRole('link').map((a) => a.textContent))
      .toEqual(['Entrar em contato', 'Consultar perguntas frequentes']);
  });

  it('identifica três fotografias reservadas sem apresentá-las como reais', () => {
    render(<Home />);

    for (const label of [
      'Máquina ou equipamento',
      'Cabo Aéreo',
      'Fachada da empresa',
    ]) {
      expect(screen.getByText(label, { selector: '.bamak-home__reserved-title' }))
        .toBeInTheDocument();
    }
  });

  it('não exibe o diagnóstico técnico da API ao visitante', () => {
    render(<Home />);

    expect(
      screen.queryByText(/Verificando API|API:|Não foi possível conectar à API/),
    ).not.toBeInTheDocument();
  });
});