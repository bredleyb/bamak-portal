import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home from './page';

describe('Página inicial', () => {
  it('exibe o estado de carregamento', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

    render(<Home />);

    expect(screen.getByText('Verificando API...')).toBeInTheDocument();
  });

  it('exibe o estado saudável da API e do banco', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'ok',
          database: 'ok',
        }),
      }),
    );

    render(<Home />);

    expect(
      await screen.findByText('API: ok / Banco: ok'),
    ).toBeInTheDocument();
  });

  it('exibe erro quando a API retorna HTTP 503', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    render(<Home />);

    expect(
      await screen.findByText('Não foi possível conectar à API.'),
    ).toBeInTheDocument();
  });

  it('exibe erro quando ocorre falha de conexão', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Conexão indisponível')),
    );

    render(<Home />);

    expect(
      await screen.findByText('Não foi possível conectar à API.'),
    ).toBeInTheDocument();
  });
});
