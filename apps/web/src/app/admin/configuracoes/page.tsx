import type { Metadata } from "next";
import { AdminSessionGate } from "../../../components/admin/admin-session-gate";
import { AdminOverview } from "../../../components/admin/admin-overview";
import "../page.css";
import "./page.css";

export const metadata: Metadata = {
  title: "Configurações administrativas | Portal Bamak",
  description: "Configurações restritas da administração Bamak.",
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return (
    <AdminSessionGate allowedRoles={["ADMINISTRATOR"]}>
      <AdminOverview page="settings" />
    </AdminSessionGate>
  );
}
