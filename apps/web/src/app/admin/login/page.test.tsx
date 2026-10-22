import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminLoginPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("ADM-01 — login administrativo", () => {
  it("usa o logotipo branco da marca", async () => {
    render(await AdminLoginPage({}));

    const logo = screen.getByAltText("Bamak Equipamentos");

    expect(logo.getAttribute("src")).toContain(
      "bamak-lockup-horizontal-white.svg",
    );
  });

  it("mostra o formulário e permite voltar ao site", async () => {
    render(await AdminLoginPage({}));

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

  it("exibe aviso de sessao expirada pelo parametro da rota", async () => {
    render(
      await AdminLoginPage({
        searchParams: Promise.resolve({
          reason: "session-expired",
        }),
      }),
    );

    expect(
      screen.getByText("Sua sessão expirou"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Entre novamente para continuar no painel."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "E-mail" }),
    ).toBeEnabled();
  });

  it("nao mostra aviso para parametros desconhecidos", async () => {
    render(
      await AdminLoginPage({
        searchParams: Promise.resolve({
          reason: "desconhecido",
        }),
      }),
    );

    expect(
      screen.queryByText("Sua sessão expirou"),
    ).not.toBeInTheDocument();
  });
});
