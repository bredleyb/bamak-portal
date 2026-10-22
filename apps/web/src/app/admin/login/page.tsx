import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "../../../components/admin/login-form";
import "./page.css";

export const metadata: Metadata = {
  title: "Entrar no painel | Portal Bamak",
  description: "Acesso restrito à equipe da Bamak Equipamentos.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="bamak-admin-login-page">
      <aside className="bamak-admin-login-page__brand">
        <Image
          src="/assets/brand/bamak-lockup-horizontal-white.svg"
          alt="Bamak Equipamentos"
          width={5673}
          height={1400}
          priority
          className="bamak-admin-login-page__logo"
        />

        <div className="bamak-admin-login-page__brand-copy">
          <h2>Portal Bamak</h2>
          <p>Atendimentos, publicações e documentos internos.</p>
          <span>ACESSO RESTRITO</span>
        </div>

        <p className="bamak-admin-login-page__compact-title">
          ÁREA ADMINISTRATIVA
        </p>
      </aside>

      <main className="bamak-admin-login-page__main">
        <div className="bamak-admin-login-page__content">
          <LoginForm />

          <Link href="/" className="bamak-admin-login-page__back">
            ← Voltar ao site
          </Link>

          <p className="bamak-admin-login-page__copyright">
            Bamak Equipamentos LTDA
          </p>
        </div>
      </main>
    </div>
  );
}