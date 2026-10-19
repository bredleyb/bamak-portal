import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContentCard } from './content-card';

const application = {
  type: 'application' as const,
  title: 'Aplicações industriais',
  description: 'Equipamentos em contexto real.',
  actionLabel: 'Conhecer aplicações',
  href: '/aplicacoes',
};

describe('ContentCard', () => {
  it('renderiza um artigo com título, descrição e link funcional', () => {
    render(<ContentCard {...application} />);

    expect(screen.getByRole('article')).toHaveClass(
      'bamak-content-card',
      'bamak-content-card--application',
    );

    expect(
      screen.getByRole('heading', {
        name: 'Aplicações industriais',
        level: 3,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Equipamentos em contexto real.'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: 'Conhecer aplicações',
      }),
    ).toHaveAttribute('href', '/aplicacoes');
  });

  it.each([
    ['application', 'Fotografia de aplicação'],
    ['product', 'Fotografia de produto'],
    ['publication', 'Imagem de publicação'],
  ] as const)(
    'identifica corretamente a mídia pendente de %s',
    (type, placeholderLabel) => {
      render(
        <ContentCard
          {...application}
          type={type}
        />,
      );

      expect(screen.getByRole('article')).toHaveClass(
        `bamak-content-card--${type}`,
      );

      expect(
        screen.getByText(placeholderLabel),
      ).toBeInTheDocument();
    },
  );

  it.each([
    ['application', 'wide'],
    ['product', 'product'],
    ['publication', 'wide'],
  ] as const)(
    'prepara o enquadramento da mídia de %s',
    (type, ratio) => {
      const { container } = render(
        <ContentCard
          {...application}
          type={type}
        />,
      );

      expect(
        container.querySelector('.bamak-content-card__media'),
      ).toHaveClass(
        `bamak-content-card__media--${ratio}`,
      );
    },
  );

  it('não apresenta placeholder como fotografia documental', () => {
    render(<ContentCard {...application} />);

    expect(
      screen.getByText('Fotografia de aplicação'),
    ).toBeInTheDocument();

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('aceita fotografia com texto alternativo descritivo', () => {
    render(
      <ContentCard
        {...application}
        type="product"
        image={{
          src: '/test-fixtures/equipamento.jpg',
          alt: 'Equipamento industrial em ambiente de trabalho.',
        }}
      />,
    );

    expect(
      screen.getByRole('img', {
        name: 'Equipamento industrial em ambiente de trabalho.',
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Fotografia de produto'),
    ).not.toBeInTheDocument();
  });

  it('permite classes adicionais sem remover as classes internas', () => {
    render(
      <ContentCard
        {...application}
        className="card-personalizado"
      />,
    );

    expect(screen.getByRole('article')).toHaveClass(
      'bamak-content-card',
      'bamak-content-card--application',
      'card-personalizado',
    );
  });

  it('preserva integralmente textos extensos', () => {
    const title =
      'Equipamentos industriais para diferentes condições de operação';

    const description =
      'Informações detalhadas sobre aplicações, características ' +
      'e condições de utilização em diferentes ambientes industriais.';

    render(
      <ContentCard
        {...application}
        title={title}
        description={description}
      />,
    );

    expect(
      screen.getByRole('heading', { name: title }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(description),
    ).toHaveTextContent(description);
  });

  it('mantém links independentes em múltiplos cards', () => {
    render(
      <>
        <ContentCard {...application} />
        <ContentCard
          type="publication"
          title="Notícias"
          description="Atualizações da empresa."
          actionLabel="Ler publicações"
          href="/publicacoes"
        />
      </>,
    );

    expect(
      screen.getByRole('link', {
        name: 'Conhecer aplicações',
      }),
    ).toHaveAttribute('href', '/aplicacoes');

    expect(
      screen.getByRole('link', {
        name: 'Ler publicações',
      }),
    ).toHaveAttribute('href', '/publicacoes');

    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
});
