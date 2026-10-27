import { render, screen, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import userEvent from '@testing-library/user-event';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { LoginForm } from './login-form';

const replace = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

describe('LoginForm administrativo', () => {
  const email = 'operador@example.invalid';
  const password = 'SenhaFicticia123!';

  beforeEach(() => {
    replace.mockReset();
    vi.stubEnv(
      'NEXT_PUBLIC_API_URL',
      'http://localhost:3001/api',
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  async function fillForm() {
    const user = userEvent.setup();

    await user.type(
      screen.getByRole('textbox', { name: 'E-mail' }),
      email,
    );

    await user.type(
      screen.getByLabelText('Senha'),
      password,
    );

    return user;
  }

  it('renderiza os campos e a acao previstos no Figma', () => {
    render(<LoginForm />);

    expect(
      screen.getByRole('textbox', { name: 'E-mail' }),
    ).toBeRequired();

    expect(
      screen.getByLabelText('Senha'),
    ).toHaveAttribute('type', 'password');

    expect(
      screen.getByRole('button', {
        name: 'Entrar no painel',
      }),
    ).toHaveAttribute('type', 'submit');
  });

  it('nao envia credenciais pela URL no fallback nativo', () => {
    const { container } = render(<LoginForm />);

    const form = container.querySelector('form');

    expect(form).not.toBeNull();
    expect(form).toHaveAttribute('method', 'post');
    expect(form).toHaveAttribute('action', '/admin/login');
  });

  it('desabilita o envio no HTML antes da hidratacao', () => {
    const markup = renderToStaticMarkup(<LoginForm />);

    const template = document.createElement('template');
    template.innerHTML = markup;

    const submit = template.content.querySelector(
      'button[type="submit"]',
    );

    expect(submit).not.toBeNull();
    expect(submit?.hasAttribute('disabled')).toBe(true);
  });

  it('preserva os textos dos campos da referencia ADM-01', () => {
    render(<LoginForm />);

    expect(
      screen.getByRole('textbox', { name: 'E-mail' }),
    ).toHaveAttribute('placeholder', 'seu e-mail de acesso');

    expect(
      screen.getByLabelText('Senha'),
    ).toHaveAttribute('placeholder', 'Informe sua senha');
  });
  it('permite mostrar e ocultar a senha', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(
      screen.getByRole('button', { name: 'Mostrar senha' }),
    );

    expect(
      screen.getByLabelText('Senha'),
    ).toHaveAttribute('type', 'text');

    await user.click(
      screen.getByRole('button', { name: 'Ocultar senha' }),
    );

    expect(
      screen.getByLabelText('Senha'),
    ).toHaveAttribute('type', 'password');
  });

  it('envia credenciais com cookies habilitados', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        expiresAt: '2026-10-23T12:00:00.000Z',
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<LoginForm />);

    const user = await fillForm();

    await user.click(
      screen.getByRole('button', {
        name: 'Entrar no painel',
      }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ email, password }),
      }),
    );
  });

  it('redireciona ao painel apos autenticar', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          expiresAt: '2026-10-23T12:00:00.000Z',
        }),
      }),
    );

    render(<LoginForm />);

    const user = await fillForm();

    await user.click(
      screen.getByRole('button', {
        name: 'Entrar no painel',
      }),
    );

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/admin');
    });
  });

  it('exibe mensagem generica para credenciais invalidas', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    );

    render(<LoginForm />);

    const user = await fillForm();

    await user.click(
      screen.getByRole('button', {
        name: 'Entrar no painel',
      }),
    );

    expect(
      await screen.findByText("Não foi possível entrar"),
    ).toBeInTheDocument();

    expect(replace).not.toHaveBeenCalled();
  });

  it('informa quando o limite de tentativas e atingido', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      }),
    );

    render(<LoginForm />);

    const user = await fillForm();

    await user.click(
      screen.getByRole('button', {
        name: 'Entrar no painel',
      }),
    );

    expect(
      await screen.findByText(/muitas tentativas/i),
    ).toBeInTheDocument();
  });

  it('exibe mensagem segura em falhas de conexao', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(
        new Error('Detalhe interno ficticio'),
      ),
    );

    render(<LoginForm />);

    const user = await fillForm();

    await user.click(
      screen.getByRole('button', {
        name: 'Entrar no painel',
      }),
    );

    expect(
      await screen.findByText(/não foi possível conectar/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/detalhe interno ficticio/i),
    ).not.toBeInTheDocument();
  });
});