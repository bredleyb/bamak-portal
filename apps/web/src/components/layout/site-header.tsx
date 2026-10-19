"use client";

import Image from "next/image";
import Link from "next/link";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="bamak-site-header">
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
            >
              {destination.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contato"
          className="bamak-site-header__contact"
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
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="bamak-site-header__mobile-link"
              onClick={closeMenu}
            >
              {destination.label}
            </Link>
          ))}

          <Link
            href="/contato"
            className="bamak-site-header__mobile-contact"
            onClick={closeMenu}
          >
            Contato
          </Link>
        </nav>
      )}
    </header>
  );
}
