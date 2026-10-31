"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  FileText,
  UserRound,
  Settings2,
} from "lucide-react";
import {
  useAdminIdentity,
  type AdminRole,
} from "./admin-session-gate";
import { AdminSettingsContent } from "./admin-settings-content";
import { AdminUsersContent } from "./admin-users-content";
import {
  adminRoutes,
  type AdminPageKey,
} from "./admin-route-hierarchy";
const navigationItems = [
  { label: "Painel", href: adminRoutes.overview.href, icon: LayoutDashboard },
  { label: "Atendimentos", href: null, icon: Inbox },
  { label: "Comunicação", href: null, icon: FileText },
  { label: "Configurações", href: adminRoutes.settings.href, icon: Settings2 },
] as const;

const indicators = [
  {
    title: "Total recebido",
    description: "Todos os tipos",
  },
  {
    title: "Contatos gerais",
    description: "Formulário de contato",
  },
  {
    title: "Cabo Aéreo",
    description: "Solicitações recebidas",
  },
  {
    title: "Em aberto",
    description: "Atendimentos pendentes",
  },
] as const;

function NavigationItems({
  role,
  page,
  onNavigate,
}: {
  role: AdminRole;
  page: AdminPageKey;
  onNavigate?: () => void;
}) {
  const visibleItems = navigationItems.filter(
    (item) =>
      role === "ADMINISTRATOR" ||
      item.label === "Painel" ||
      item.label === "Atendimentos",
  );
  return (
    <>
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const currentHref = adminRoutes[page].sectionHref;
        const isActive = item.href === currentHref;

        const content = (
          <>
            <Icon size={20} strokeWidth={2} aria-hidden="true" />
            <span>{item.label}</span>
          </>
        );

        return item.href ? (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            aria-label={item.label}
            title={item.label}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "bamak-admin-overview__nav-item bamak-admin-overview__nav-item--active"
                : "bamak-admin-overview__nav-item"
            }
          >
            {content}
          </Link>
        ) : (
          <span
            key={item.label}
            aria-disabled="true"
            title={item.label}
            className="bamak-admin-overview__nav-item bamak-admin-overview__nav-item--pending"
          >
            {content}
          </span>
        );
      })}
    </>
  );
}

export function AdminOverview({
  page = "overview",
}: Readonly<{ page?: AdminPageKey }>) {
  const { role } = useAdminIdentity();

  const roleLabel =
    role === "ADMINISTRATOR" ? "Administrador" : "Operador";

  const roleCode =
    role === "ADMINISTRATOR" ? "ADM" : "OPR";

  const { replace } = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountContainerRef = useRef<HTMLDivElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const accountLogoutRef = useRef<HTMLButtonElement>(null);

  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const logoutInFlight = useRef(false);

  function closeDrawer() {
    setDrawerOpen(false);
    menuTriggerRef.current?.focus();
  }

  function openDrawer() {
    setLogoutError(false);
    setDrawerOpen(true);
  }

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function focusableElements() {
      return Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          focusableSelector,
        ) ?? [],
      );
    }

    focusableElements()[0]?.focus();

    function handleViewportResize() {
      if (window.innerWidth >= 768) {
        setDrawerOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = focusableElements();

      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement;

      if (!drawerRef.current?.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportResize);

    return () => {
      window.removeEventListener("resize", handleViewportResize);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!accountOpen) {
      return;
    }

    accountLogoutRef.current?.focus();

    function handleOutsidePointer(event: PointerEvent) {
      const container = accountContainerRef.current;

      if (
        container &&
        event.target instanceof Node &&
        !container.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    }

    function handleAccountKeyboard(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      setAccountOpen(false);
      accountTriggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleAccountKeyboard);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointer,
      );
      document.removeEventListener(
        "keydown",
        handleAccountKeyboard,
      );
    };
  }, [accountOpen]);
  async function handleLogout() {
    if (logoutInFlight.current) {
      return;
    }

    logoutInFlight.current = true;
    setLoggingOut(true);
    setLogoutError(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        setLogoutError(true);
        return;
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (response.status !== 204) {
        setLogoutError(true);
        return;
      }

      setDrawerOpen(false);
      setAccountOpen(false);
      replace("/admin/login");
    } catch {
      setLogoutError(true);
    } finally {
      logoutInFlight.current = false;
      setLoggingOut(false);
    }
  }
  return (
    <div
      className={
        page !== "overview"
          ? "bamak-admin-overview bamak-admin-overview--settings"
          : "bamak-admin-overview"
      }
    >
      <aside className="bamak-admin-overview__sidebar">
        <Link
          href="/admin"
          className="bamak-admin-overview__brand"
          aria-label="Portal Bamak — Painel"
        >
          <Image
            src="/assets/brand/bamak-lockup-horizontal-green.svg"
            alt="Bamak Equipamentos"
            width={166}
            height={41}
            priority
          />
        </Link>

        <Link
          href="/admin"
          className="bamak-admin-overview__rail-brand"
          aria-label="Bamak — ir ao painel"
        >
          <Image
            src="/assets/brand/bamak-symbol-green.svg"
            alt="Símbolo Bamak"
            width={46}
            height={32}
          />
        </Link>

        <nav
          aria-label="Navegação administrativa"
          className="bamak-admin-overview__navigation"
        >
          <NavigationItems role={role} page={page} />
        </nav>


      </aside>

      <div className="bamak-admin-overview__workspace">
        <header className="bamak-admin-overview__topbar">
          <button
            ref={menuTriggerRef}
            type="button"
            className="bamak-admin-overview__mobile-menu"
            aria-label="Abrir menu administrativo"
            aria-controls="bamak-admin-mobile-drawer"
            aria-expanded={drawerOpen}
            onClick={openDrawer}
          >
            <Menu size={22} aria-hidden="true" />
          </button>

          {drawerOpen && (
            <div className="bamak-admin-overview__drawer-layer">
              <button
                type="button"
                className="bamak-admin-overview__drawer-backdrop"
                aria-label="Fechar menu administrativo"
                onClick={closeDrawer}
              />

              <div
                ref={drawerRef}
                id="bamak-admin-mobile-drawer"
                role="dialog"
                aria-label="Menu administrativo"
                aria-modal="true"
                className="bamak-admin-overview__drawer"
              >
                <div className="bamak-admin-overview__drawer-header">
                  <Image
                    src="/assets/brand/bamak-lockup-horizontal-green.svg"
                    alt="Bamak Equipamentos"
                    width={166}
                    height={41}
                  />

                  <p>ÁREA ADMINISTRATIVA</p>
                </div>

                <nav
                  aria-label="Navegação do menu administrativo"
                  className="bamak-admin-overview__drawer-navigation"
                >
                  <NavigationItems
                    role={role}
                    page={page}
                    onNavigate={closeDrawer}
                  />
                </nav>

                <div className="bamak-admin-overview__drawer-footer">
                  <p className="bamak-admin-overview__drawer-section">
                    PERFIL
                  </p>

                  <p className="bamak-admin-overview__drawer-account">
                    <UserRound size={20} aria-hidden="true" />
                    <span>{roleLabel}</span>
                  </p>

                  <button
                    type="button"
                    className="bamak-admin-overview__drawer-logout"
                    disabled={loggingOut}
                    onClick={() => void handleLogout()}
                  >
                    <LogOut size={20} aria-hidden="true" />
                    <span>
                      {loggingOut
                        ? "Saindo da conta…"
                        : "Sair da conta"}
                    </span>
                  </button>

                  {logoutError && (
                    <p
                      role="alert"
                      className="bamak-admin-overview__drawer-error"
                    >
                      Não foi possível sair da conta
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bamak-admin-overview__topbar-brand">
            <Image
              src="/assets/brand/bamak-lockup-horizontal-green.svg"
              alt="Bamak Equipamentos"
              width={104}
              height={26}
            />
          </div>

          <nav
            className="bamak-admin-overview__breadcrumb"
            aria-label="Trilha administrativa"
          >
            <ol>
              {adminRoutes[page].breadcrumbs.map((crumb) => (
                <li key={crumb.label}>
                  {crumb.href ? (
                    <Link href={crumb.href}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div
            ref={accountContainerRef}
            className="bamak-admin-overview__account"
          >
            <button
              ref={accountTriggerRef}
              type="button"
              className="bamak-admin-overview__profile bamak-admin-overview__profile--trigger"
              aria-label="Abrir opções da conta"
              aria-controls="bamak-admin-account-options"
              aria-expanded={accountOpen}
              onClick={() => {
                setLogoutError(false);
                setAccountOpen((current) => !current);
              }}
            >
              <span className="bamak-admin-overview__profile-name">
                {roleLabel}
              </span>
            </button>

            <span
              className="bamak-admin-overview__profile bamak-admin-overview__profile--mobile"
            >
              <span className="bamak-admin-overview__profile-short">
                {roleCode}
              </span>
            </span>

            {accountOpen && (
              <div
                id="bamak-admin-account-options"
                role="group"
                aria-label="Opções da conta"
                className="bamak-admin-overview__account-options"
              >
                <p className="bamak-admin-overview__account-role">
                  {roleLabel}
                </p>

                <button
                  ref={accountLogoutRef}
                  type="button"
                  className="bamak-admin-overview__account-logout"
                  disabled={loggingOut}
                  onClick={() => void handleLogout()}
                >
                  <LogOut size={18} aria-hidden="true" />
                  <span>
                    {loggingOut
                      ? "Saindo da conta…"
                      : "Sair da conta"}
                  </span>
                </button>

                {logoutError && (
                  <p
                    role="alert"
                    className="bamak-admin-overview__account-error"
                  >
                    Não foi possível sair da conta
                  </p>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="bamak-admin-overview__content">
          {page === "settings" ? (
            <AdminSettingsContent />
          ) : page === "users" ? (
            <AdminUsersContent />
          ) : (
            <>
          <div className="bamak-admin-overview__intro">

            <h1>Visão geral</h1>

          </div>

          <section
            className="bamak-admin-overview__indicators"
            aria-labelledby="admin-overview-indicators-title"
          >
            <h2 id="admin-overview-indicators-title">
              Atendimentos
            </h2>

            <div className="bamak-admin-overview__metric-grid">
              {indicators.map((indicator) => (
                <article
                  key={indicator.title}
                  className="bamak-admin-overview__metric"
                >
                  <h3>{indicator.title}</h3>
                  <p
                    className="bamak-admin-overview__metric-value"
                    aria-label="Dado ainda não disponível"
                  >
                    —
                  </p>
                  <p>{indicator.description}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="bamak-admin-overview__sections">
            <section
              className="bamak-admin-overview__recent"
              aria-labelledby="admin-overview-recent-title"
            >
              <h2 id="admin-overview-recent-title">
                Entradas recentes
              </h2>

              <div className="bamak-admin-overview__empty">
                <p>
                  Dados de atendimentos ainda não disponíveis.
                </p>
              </div>
            </section>

            <section
              className="bamak-admin-overview__pending"
              aria-labelledby="admin-overview-pending-title"
            >
              <h2 id="admin-overview-pending-title">
                Pendências operacionais
              </h2>


              <div className="bamak-admin-overview__empty">
                <p>
                  Dados de pendências ainda não disponíveis.
                </p>
              </div>
            </section>
          </div>

          <div className="bamak-admin-overview__actions">
            <button type="button" disabled>
              Ver atendimentos
            </button>

            {role === "ADMINISTRATOR" && (
              <button type="button" disabled>
                Gerenciar comunicação
              </button>
            )}
          </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
