import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RootLayout, { metadata } from "./layout";
import SiteLayout from "./(site)/layout";

vi.mock("next/font/google", () => ({
  Archivo: () => ({ variable: "mock-font-archivo" }),
  Source_Sans_3: () => ({ variable: "mock-font-source-sans-3" }),
}));

function renderLayout() {
  const html = renderToStaticMarkup(
    <RootLayout params={Promise.resolve({})}>
      <SiteLayout>
      <main id="conteudo-teste">
        <h1>Conteúdo da página de teste</h1>
      </main>
          </SiteLayout>
    </RootLayout>,
  );

  return new DOMParser().parseFromString(html, "text/html");
}

describe("RootLayout", () => {
  it("preserva o idioma português e a configuração tipográfica", () => {
    const document = renderLayout();

    expect(document.documentElement.lang).toBe("pt-BR");
    expect(
      document.documentElement.classList.contains("mock-font-archivo"),
    ).toBe(true);

    expect(
      document.documentElement.classList.contains("mock-font-source-sans-3"),
    ).toBe(true);

    expect(document.body.classList.contains("flex")).toBe(true);
    expect(document.body.classList.contains("flex-col")).toBe(true);
  });

  it("mantém o título e a descrição institucionais", () => {
    expect(metadata.title).toBe(
      "Portal Bamak | Bamak Equipamentos",
    );
    expect(metadata.description).toContain(
      "Portal institucional da Bamak Equipamentos",
    );
  });

  it("renderiza o cabeçalho, o conteúdo e o rodapé nesta ordem", () => {
    const document = renderLayout();

    const header = document.querySelector(
      "header.bamak-site-header",
    );
    const main = document.querySelector("#conteudo-teste");
    const footer = document.querySelector(
      "footer.bamak-site-footer",
    );

    expect(header).not.toBeNull();
    expect(main).not.toBeNull();
    expect(footer).not.toBeNull();

    expect(document.body.firstElementChild).toBe(header);
    expect(document.body.lastElementChild).toBe(footer);
    expect(document.querySelectorAll("main")).toHaveLength(1);

    expect(main?.textContent).toContain(
      "Conteúdo da página de teste",
    );
  });

  it("permite que o conteúdo ocupe o espaço disponível", () => {
    const document = renderLayout();

    const main = document.querySelector("#conteudo-teste");

    expect(
      main?.parentElement?.classList.contains("flex-1"),
    ).toBe(true);
  });

  it("disponibiliza navegação e contato nas regiões compartilhadas", () => {
    const document = renderLayout();

    const header = document.querySelector(
      "header.bamak-site-header",
    );
    const footer = document.querySelector(
      "footer.bamak-site-footer",
    );

    expect(header).not.toBeNull();
    expect(footer).not.toBeNull();

    expect(
      header?.querySelector(
        'nav[aria-label="Navegação principal"]',
      ),
    ).not.toBeNull();

    expect(
      header?.querySelector('a[href="/contato"]'),
    ).not.toBeNull();

    expect(
      footer?.querySelector(
        'nav[aria-label="Empresa e soluções"]',
      ),
    ).not.toBeNull();

    expect(
      footer?.querySelector(
        'a[href="mailto:bamak@bamak.com.br"]',
      ),
    ).not.toBeNull();
  });
});
