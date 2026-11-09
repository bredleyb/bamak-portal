import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("PUB-01 — Notícias e agenda sem publicações (HOME-COM-06)", () => {
  it("mantém a seção visível com mensagem editorial e sem notícias fictícias", () => {
    render(<Home />);

    const secao = screen.getByRole("region", { name: "Notícias e agenda" });

    expect(
      within(secao).getByRole("heading", { level: 2, name: "Notícias e agenda" }),
    ).toBeInTheDocument();
    expect(
      within(secao).getByText(
        "Acompanhe notícias, eventos, feiras e comunicados da Bamak. As publicações aparecerão aqui quando forem disponibilizadas.",
      ),
    ).toBeInTheDocument();
    expect(within(secao).queryAllByRole("article")).toHaveLength(0);
    expect(within(secao).queryByText(/\[Título da notícia|\[Título do evento/)).not.toBeInTheDocument();
  });

  it("oferece um único encaminhamento semântico para Comunicação", () => {
    render(<Home />);

    const secao = screen.getByRole("region", { name: "Notícias e agenda" });
    const links = within(secao).getAllByRole("link");

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName("Conhecer a área de Comunicação");
    expect(links[0]).toHaveAttribute("href", "/comunicacao");
    expect(within(secao).queryByRole("button", { name: /carrossel|anterior|próximo/i })).not.toBeInTheDocument();
  });

  it("posiciona a seção entre Explore as soluções e Nossa trajetória", () => {
    render(<Home />);

    const titulos = screen
      .getAllByRole("heading", { level: 2 })
      .map((titulo) => titulo.textContent?.trim());

    const explorar = titulos.indexOf("Explore as soluções");
    const noticias = titulos.indexOf("Notícias e agenda");
    const trajetoria = titulos.indexOf("Nossa trajetória");

    expect(explorar).toBeGreaterThanOrEqual(0);
    expect(noticias).toBeGreaterThan(explorar);
    expect(trajetoria).toBeGreaterThan(noticias);
  });
});
