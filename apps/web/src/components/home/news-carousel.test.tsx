import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import NewsCarousel, { type HomePublication } from "./news-carousel";

// Dados exclusivamente de teste: nenhuma publicação institucional é presumida.
const publications: readonly HomePublication[] = [
  { id: "teste-1", kind: "noticia", title: "Notícia fictícia A", dateLabel: "12/10/2026", href: "/comunicacao/teste-1" },
  { id: "teste-2", kind: "evento", title: "Evento fictício B", dateLabel: "13/10/2026", href: "/comunicacao/teste-2" },
  { id: "teste-3", kind: "feira", title: "Feira fictícia C", dateLabel: "14/10/2026", href: "/comunicacao/teste-3" },
  { id: "teste-4", kind: "comunicado", title: "Comunicado fictício D", dateLabel: "15/10/2026", href: "/comunicacao/teste-4" },
  { id: "teste-5", kind: "agenda", title: "Agenda fictícia E", dateLabel: "16/10/2026", href: "/comunicacao/teste-5" },
  { id: "teste-6", kind: "noticia", title: "Notícia fictícia F", dateLabel: "17/10/2026", href: "/comunicacao/teste-6" },
];

function mockMedia({ mobile = false, reducedMotion = false } = {}) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("max-width: 767px") ? mobile :
      query.includes("prefers-reduced-motion") ? reducedMotion : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("HOME-COM-07 — carrossel de publicações da Home", () => {
  it("exibe seis cartões sem inventar conteúdo e preserva o destino de cada publicação", () => {
    mockMedia();
    render(<NewsCarousel publications={publications} />);

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(6);
    expect(within(cards[0]).getByText("NOTÍCIA")).toBeInTheDocument();
    expect(within(cards[1]).getByText("EVENTO")).toBeInTheDocument();
    expect(within(cards[0]).getByText("Notícia fictícia A")).toBeInTheDocument();
    expect(within(cards[1]).getByText("Evento fictício B")).toBeInTheDocument();
    expect(within(cards[0]).getByRole("link", { name: /Ler publicação/ }))
      .toHaveAttribute("href", "/comunicacao/teste-1");
    expect(within(cards[1]).getByRole("link", { name: /Ver evento/ }))
      .toHaveAttribute("href", "/comunicacao/teste-2");
  });

  it("avança, retrocede e fecha o ciclo de seis posições com controles acessíveis", () => {
    mockMedia();
    render(<NewsCarousel publications={publications} />);

    expect(screen.getByText("1 de 6")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Próxima publicação" }));
    expect(screen.getByText("2 de 6")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Publicação anterior" }));
    expect(screen.getByText("1 de 6")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Publicação anterior" }));
    expect(screen.getByText("6 de 6")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Próxima publicação" }));
    expect(screen.getByText("1 de 6")).toBeInTheDocument();
  });

  it("avança automaticamente a cada 5 segundos no desktop e permite pausa e retomada", () => {
    mockMedia();
    vi.useFakeTimers();
    render(<NewsCarousel publications={publications} />);

    expect(screen.getByRole("button", { name: "Pausar carrossel" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("2 de 6")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Pausar carrossel" }));
    expect(screen.getByRole("button", { name: "Retomar carrossel" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByText("2 de 6")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retomar carrossel" }));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("3 de 6")).toBeInTheDocument();
  });

  it("inicia pausado no mobile e respeita preferência por movimento reduzido", () => {
    for (const preferences of [{ mobile: true }, { reducedMotion: true }]) {
      mockMedia(preferences);
      vi.useFakeTimers();
      const view = render(<NewsCarousel publications={publications} />);
      expect(screen.getByRole("button", { name: "Retomar carrossel" })).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(10000));
      expect(screen.getByText("1 de 6")).toBeInTheDocument();
      view.unmount();
      vi.useRealTimers();
    }
  });

  it("não apresenta controles de movimento para um único cartão", () => {
    mockMedia();
    render(<NewsCarousel publications={publications.slice(0, 1)} />);
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: /carrossel|publicação/i })).not.toBeInTheDocument();
  });

  it("não gera cartões ou controles quando não há publicações", () => {
    mockMedia();
    const { container } = render(<NewsCarousel publications={[]} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("mantém o sexto cartão alcançável mesmo quando três cartões já aparecem no desktop", () => {
    mockMedia();
    const originalOffset = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetLeft");
    const originalScroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollTo");
    Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
      configurable: true,
      get() {
        const parent = this.parentElement;
        return parent?.classList.contains("bamak-news-carousel__track")
          ? Array.from(parent.children).indexOf(this) * 402
          : 0;
      },
    });
    try {
      const view = render(<NewsCarousel publications={publications} />);
      const viewport = view.container.querySelector<HTMLElement>(".bamak-news-carousel__viewport");
      if (!viewport) throw new Error("Viewport não encontrado");
      const scrollRequests: { left: number; behavior: ScrollBehavior }[] = [];
      Object.defineProperty(viewport, "scrollTo", {
        configurable: true,
        value: ({ left, behavior }: { left: number; behavior: ScrollBehavior }) => {
          const numberOfCards = viewport.querySelector(".bamak-news-carousel__track")?.children.length ?? 0;
          const maxScroll = Math.max(0, numberOfCards * 386 + (numberOfCards - 1) * 16 - 1280);
          viewport.scrollLeft = Math.min(Math.max(0, left), maxScroll);
          scrollRequests.push({ left, behavior });
        },
      });
      // Reativa a rolagem do primeiro cartão em contexto de browser simulado.
      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByRole("button", { name: "Próxima publicação" }));
      }
      expect(screen.getByText("6 de 6")).toBeInTheDocument();
      expect(scrollRequests.at(-1)?.left).toBeGreaterThan(1280);
      expect(viewport.scrollLeft).toBeGreaterThan(1116);
      expect(screen.getAllByRole("article")).toHaveLength(6);
      view.unmount();
    } finally {
      if (originalOffset) Object.defineProperty(HTMLElement.prototype, "offsetLeft", originalOffset);
      else delete (HTMLElement.prototype as unknown as {offsetLeft?: number}).offsetLeft;
      if (originalScroll) Object.defineProperty(HTMLElement.prototype, "scrollTo", originalScroll);
      else delete (HTMLElement.prototype as unknown as {scrollTo?: unknown}).scrollTo;
    }
  });

  it("realiza a passagem circular por um cartão adjacente antes do reposicionamento", () => {
    mockMedia();
    vi.useFakeTimers();
    const originalOffset = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetLeft");
    Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
      configurable: true,
      get() {
        const parent = this.parentElement;
        return parent?.classList.contains("bamak-news-carousel__track")
          ? Array.from(parent.children).indexOf(this) * 402
          : 0;
      },
    });
    try {
      const view = render(<NewsCarousel publications={publications} />);
      const viewport = view.container.querySelector<HTMLElement>(".bamak-news-carousel__viewport");
      if (!viewport) throw new Error("Viewport não encontrado");
      const scrollRequests: number[] = [];
      Object.defineProperty(viewport, "scrollTo", {
        configurable: true,
        value: ({ left }: { left: number }) => {
          scrollRequests.push(left);
        },
      });
      fireEvent.click(screen.getByRole("button", { name: "Publicação anterior" }));
      expect(screen.getByText("6 de 6")).toBeInTheDocument();
      expect(scrollRequests.at(-1)).toBe(0);
      act(() => vi.advanceTimersByTime(500));
      expect(scrollRequests.at(-1)).toBe(2412);
      fireEvent.click(screen.getByRole("button", { name: "Próxima publicação" }));
      expect(screen.getByText("1 de 6")).toBeInTheDocument();
      expect(scrollRequests.at(-1)).toBe(2814);
      act(() => vi.advanceTimersByTime(500));
      expect(scrollRequests.at(-1)).toBe(402);
      view.unmount();
    } finally {
      if (originalOffset) Object.defineProperty(HTMLElement.prototype, "offsetLeft", originalOffset);
      else delete (HTMLElement.prototype as unknown as {offsetLeft?: number}).offsetLeft;
    }
  });
});
