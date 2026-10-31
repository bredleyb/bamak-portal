import type { Metadata } from "next";
import { AdminSessionGate } from "../../../../components/admin/admin-session-gate";
import { AdminOverview } from "../../../../components/admin/admin-overview";
import "../../page.css";
import "../page.css";
import "./page.css";

export const metadata: Metadata = {
  title: "Usuários e acessos | Portal Bamak",
  description: "Gerenciamento restrito de acessos administrativos.",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return (
    <AdminSessionGate allowedRoles={["ADMINISTRATOR"]}>
      <AdminOverview page="users" />
    </AdminSessionGate>
  );
}
