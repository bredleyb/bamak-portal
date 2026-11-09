"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import "./site-header.css";

const destinations = [
  { label: "Institucional", href: "/institucional" },
  { label: "Aplicações", href: "/aplicacoes" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Cabo Aéreo", href: "/cabo-aereo" },
  { label: "FAQ", href: "/faq" },
  { label: "Comunicação", href: "/comunicacao" },
] as const;

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);

  function isCurrent(href: string) {
    return (
      pathname === href ||
      (href !== "/" && pathname.startsWith(`${href}/`))
    );
  }

  useEffect(() => {
    if (!menuOpen) return;

    const dialog = menuDialogRef.current;
    const getFocusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [],
      ).filter((element) => element.tabIndex >= 0);

    dialog
      ?.querySelector<HTMLElement>(".bamak-site-header__mobile-navigation")
      ?.querySelector<HTMLAnchorElement>("a[href]")
      ?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = getFocusable();
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!first || !last) return;

      const outside = !dialog?.contains(document.activeElement);

      if (
        event.shiftKey &&
        (document.activeElement === first || outside)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || outside)
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".bamak-site-content, .bamak-site-footer",
      ),
    );

    const previous = background.map((element) => ({
      element,
      wasInert: element.hasAttribute("inert"),
    }));

    for (const { element } of previous) {
      element.setAttribute("inert", "");
    }

    return () => {
      for (const { element, wasInert } of previous) {
        if (!wasInert) {
          element.removeAttribute("inert");
        }
      }
    };
  }, [menuOpen]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const desktop = window.matchMedia("(min-width: 1200px)");

    function handleDesktopBreakpoint(event: MediaQueryListEvent) {
      if (event.matches) {
        setMenuOpen(false);
      }
    }

    desktop.addEventListener("change", handleDesktopBreakpoint);

    return () => {
      desktop.removeEventListener("change", handleDesktopBreakpoint);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="bamak-site-header">
      <a
        href="#conteudo-principal"
        className="bamak-site-header__skip-link"
      >
        Ir para conteúdo
      </a>
      <div
        ref={menuDialogRef}
        role={menuOpen ? "dialog" : undefined}
        aria-label={menuOpen ? "Menu de navegação" : undefined}
        aria-modal={menuOpen ? "true" : undefined}
        className="bamak-site-header__dialog-shell"
      >
        <div className="bamak-site-header__inner">
        <Link
          href="/"
          aria-label="Ir para início"
          className="bamak-site-header__brand"
          onClick={closeMenu}
        >
          <Image
            src="/assets/brand/bamak-lockup-horizontal-green.svg"
            alt="Bamak Equipamentos"
            width={170}
            height={42}
            priority
          />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="bamak-site-header__navigation"
        >
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="bamak-site-header__link"
              tabIndex={menuOpen ? -1 : undefined}
              aria-current={isCurrent(destination.href) ? "page" : undefined}
            >
              {destination.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contato"
          className="bamak-site-header__contact"
          tabIndex={menuOpen ? -1 : undefined}
          aria-current={isCurrent("/contato") ? "page" : undefined}
        >
          Contato
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="bamak-site-header__menu-button"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">
            {menuOpen ? (
              <X size={24} strokeWidth={2} />
            ) : (
              <Menu size={24} strokeWidth={2} />
            )}
          </span>
        </button>
        </div>

        {menuOpen && (
          <nav
          id={menuId}
          aria-label="Navegação móvel"
          className="bamak-site-header__mobile-navigation"
        >
          <Link
            href="/"
            className="bamak-site-header__mobile-link"
            aria-current={isCurrent("/") ? "page" : undefined}
            onClick={closeMenu}
          >
            Início
          </Link>

          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="bamak-site-header__mobile-link"
              aria-current={isCurrent(destination.href) ? "page" : undefined}
              onClick={closeMenu}
            >
              {destination.label}
            </Link>
          ))}

          <Link
            href="/privacidade"
            className="bamak-site-header__mobile-link"
            aria-current={isCurrent("/privacidade") ? "page" : undefined}
            onClick={closeMenu}
          >
            Política de privacidade
          </Link>

          <Link
            href="/contato"
            className="bamak-site-header__mobile-contact"
            aria-current={isCurrent("/contato") ? "page" : undefined}
            onClick={closeMenu}
          >
            Contato
          </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
