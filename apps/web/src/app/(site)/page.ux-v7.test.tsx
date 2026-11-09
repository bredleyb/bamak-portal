import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("PUB-01 — Home UX v7", () => {
  it("apresenta o texto institucional do hero oficial", () => {
    render(<Home />);

    expect(
      screen.getByText(
        /Com sede em Schroeder \(SC\), a Bamak desenvolve e fabrica equipamentos/,
      ),
    ).toBeInTheDocument();
  });

  it("integra Aplicações, Catálogo e Cabo Aéreo na exploração", () => {
    render(<Home />);

    const exploracao = screen.getByRole("region", {
      name: "Explore as soluções",
    });

    expect(
      within(exploracao).getByRole("heading", { name: "Aplicações" }),
    ).toBeInTheDocument();

    expect(
      within(exploracao).getByRole("heading", { name: "Catálogo" }),
    ).toBeInTheDocument();

    expect(
      within(exploracao).getByRole("heading", { name: "Cabo Aéreo" }),
    ).toBeInTheDocument();
  });

  it("apresenta Nossa trajetória com a mídia reservada", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Nossa trajetória" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Fachada da empresa"),
    ).toBeInTheDocument();
  });
});