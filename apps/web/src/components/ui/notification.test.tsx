import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Notification } from './notification';

describe('Notification', () => {
  it('exibe informação por padrão com anúncio não interruptivo', () => {
    render(
      <Notification
        title="Informação"
        description="Há uma atualização disponível."
      />,
    );

    const notification = screen.getByRole('status');

    expect(notification).toHaveClass('bamak-notification--info');
    expect(screen.getByText('Informação')).toBeInTheDocument();
    expect(
      screen.getByText('Há uma atualização disponível.'),
    ).toBeInTheDocument();
  });

  it('associa título e descrição à região acessível', () => {
    render(
      <Notification
        title="Atualização de cadastro"
        description="Seus dados foram atualizados."
      />,
    );

    const notification = screen.getByRole('status');
    const title = screen.getByText('Atualização de cadastro');
    const description = screen.getByText(
      'Seus dados foram atualizados.',
    );

    expect(title.id).toBeTruthy();
    expect(description.id).toBeTruthy();

    expect(notification).toHaveAttribute(
      'aria-labelledby',
      title.id,
    );

    expect(notification).toHaveAttribute(
      'aria-describedby',
      description.id,
    );
  });

  it.each([
    ['info', 'status'],
    ['success', 'status'],
    ['warning', 'alert'],
    ['danger', 'alert'],
  ] as const)(
    'aplica o tom %s com a região acessível %s',
    (tone, role) => {
      render(
        <Notification
          tone={tone}
          title="Atualização"
          description="Consulte os detalhes da operação."
        />,
      );

      expect(screen.getByRole(role)).toHaveClass(
        `bamak-notification--${tone}`,
      );
    },
  );

  it('permite classes adicionais sem substituir as classes internas', () => {
    render(
      <Notification
        className="mensagem-personalizada"
        title="Informação"
        description="Mensagem de teste."
      />,
    );

    expect(screen.getByRole('status')).toHaveClass(
      'bamak-notification',
      'bamak-notification--info',
      'mensagem-personalizada',
    );
  });

  it('gera identificadores distintos para notificações diferentes', () => {
    render(
      <>
        <Notification
          title="Primeira mensagem"
          description="Primeira descrição."
        />
        <Notification
          title="Segunda mensagem"
          description="Segunda descrição."
        />
      </>,
    );

    const notifications = screen.getAllByRole('status');

    expect(notifications).toHaveLength(2);

    const firstLabelId = notifications[0].getAttribute(
      'aria-labelledby',
    );

    const secondLabelId = notifications[1].getAttribute(
      'aria-labelledby',
    );

    expect(firstLabelId).toBeTruthy();
    expect(secondLabelId).toBeTruthy();
    expect(firstLabelId).not.toBe(secondLabelId);
  });

  it('preserva integralmente mensagens com orientações de recuperação', () => {
    const description =
      'Não foi possível enviar a solicitação. ' +
      'Verifique os campos obrigatórios e tente novamente.';

    render(
      <Notification
        tone="danger"
        title="Falha no envio"
        description={description}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      description,
    );
  });
});
