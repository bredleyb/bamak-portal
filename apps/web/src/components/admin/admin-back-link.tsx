import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  adminRoutes,
  type AdminPageKey,
} from "./admin-route-hierarchy";

export function AdminBackLink({
  page,
}: Readonly<{ page: AdminPageKey }>) {
  const parent = adminRoutes[page].parent;

  if (!parent) {
    return null;
  }

  return (
    <Link
      href={parent.href}
      aria-label={parent.accessibleLabel}
      title={parent.accessibleLabel}
      className="bamak-admin-overview__back-link"
    >
      <ArrowLeft
        size={20}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Link>
  );
}
