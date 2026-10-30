export type AdminPageKey = "overview" | "settings" | "users";

type AdminBreadcrumb = {
  label: string;
  href?: string;
};

type AdminRouteDefinition = {
  href: string;
  sectionHref: string;
  breadcrumbs: readonly AdminBreadcrumb[];
  parent?: {
    href: string;
    accessibleLabel: string;
  };
};

export const adminRoutes: Record<
  AdminPageKey,
  AdminRouteDefinition
> = {
  overview: {
    href: "/admin",
    sectionHref: "/admin",
    breadcrumbs: [
      { label: "Administração" },
      { label: "Painel" },
    ],
  },
  settings: {
    href: "/admin/configuracoes",
    sectionHref: "/admin/configuracoes",
    breadcrumbs: [
      { label: "Administração", href: "/admin" },
      { label: "Configurações" },
    ],
  },
  users: {
    href: "/admin/configuracoes/usuarios",
    sectionHref: "/admin/configuracoes",
    breadcrumbs: [
      { label: "Administração", href: "/admin" },
      {
        label: "Configurações",
        href: "/admin/configuracoes",
      },
      { label: "Usuários e acessos" },
    ],
    parent: {
      href: "/admin/configuracoes",
      accessibleLabel: "Voltar às configurações",
    },
  },
};
