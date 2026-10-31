import type { Metadata } from "next";
import { AdminSessionGate } from "../../components/admin/admin-session-gate";
import { AdminOverview } from "../../components/admin/admin-overview";
import "./page.css";

export const metadata: Metadata = {
  title: "Painel administrativo | Portal Bamak",
  description: "Área restrita à equipe da Bamak Equipamentos.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminSessionGate>
      <AdminOverview />
    </AdminSessionGate>
  );
}