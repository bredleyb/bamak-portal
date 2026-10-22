import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminLoginPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("ADM-01 — login administrativo", () => {
  it("usa o logotipo branco da marca", () => {
    render(<AdminLoginPage />);

    const logo = screen.getByAltText("Bamak Equipamentos");

    expect(logo.getAttribute("src")).toContain(
      "bamak-lockup-horizontal-white.svg",
    );
  });

  it("mostra o formulário e permite voltar ao site", () => {
    render(<AdminLoginPage />);

    expect(
      screen.getByRole("heading", { name: "Entrar no painel" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /voltar ao site/i }),
    ).toHaveAttribute("href", "/");

    expect(
      screen.getByText("ÁREA ADMINISTRATIVA"),
    ).toBeInTheDocument();
  });

  it("impede a indexação da página de login", () => {
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});