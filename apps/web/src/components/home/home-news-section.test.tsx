import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../../app/(site)/page";
import HomeNewsSection from "./home-news-section";
import type { HomePublication } from "./news-carousel";

// Fixtures isoladas: nenhum conteúdo fictício é servido na Home pública.
const fixtures: readonly HomePublication[] = [
  { id: "qa-01", kind: "noticia", title: "Notícia fictícia para teste", dateLabel: "02/11/2026", href: "/comunicacao/qa-01" },
  { id: "qa-02", kind: "evento", title: "Evento fictício para teste", dateLabel: "03/11/2026", href: "/comunicacao/qa-02" },
];

describe("HOME-COM-07 — integração condicional à Home", () => {
  it("preserva o estado vazio na Home pública enquanto não houver dados reais", () => {
    render(<Home />);
    const region = screen.getByRole("region", { name: "Notícias e agenda" });
    expect(within(region).getByText(/As publicações aparecerão aqui/)).toBeInTheDocument();
    expect(within(region).queryAllByRole("article")).toHaveLength(0);
    expect(within(region).getAllByRole("link")).toHaveLength(1);
  });

  it("substitui o vazio pelo carrossel quando recebe publicações", () => {
    render(<HomeNewsSection publications={fixtures} />);
    const region = screen.getByRole("region", { name: "Notícias e agenda" });
    const cards = within(region).getAllByRole("article");
    expect(cards).toHaveLength(2);
    expect(within(region).queryByText(/As publicações aparecerão aqui/)).not.toBeInTheDocument();
    expect(within(cards[0]).getByRole("link")).toHaveAttribute("href", "/comunicacao/qa-01");
    expect(within(cards[1]).getByRole("link")).toHaveAttribute("href", "/comunicacao/qa-02");
    expect(within(region).getByRole("link", { name: "Ver todas as publicações" }))
      .toHaveAttribute("href", "/comunicacao");
  });

  it("mantém um só cartão e elimina controles desnecessários quando recebe um item", () => {
    render(<HomeNewsSection publications={fixtures.slice(0, 1)} />);
    const region = screen.getByRole("region", { name: "Notícias e agenda" });
    expect(within(region).getAllByRole("article")).toHaveLength(1);
    expect(within(region).queryByRole("button", { name: /carrossel|publicação/i }))
      .not.toBeInTheDocument();
  });
});
