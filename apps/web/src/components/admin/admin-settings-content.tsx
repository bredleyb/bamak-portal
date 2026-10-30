import Link from "next/link";

export function AdminSettingsContent() {
  return (
    <>
      <div className="bamak-admin-overview__intro">
        <h1>Configurações</h1>
      </div>

      <section
        className="bamak-admin-settings__card"
        aria-labelledby="admin-settings-security-title"
      >
        <h2 id="admin-settings-security-title">
          Segurança da conta
        </h2>
        <button type="button" disabled>
          Alterar senha
        </button>
      </section>


      <section
        className="bamak-admin-settings__card"
        aria-labelledby="admin-settings-users-title"
      >
        <h2 id="admin-settings-users-title">
          Usuários e permissões
        </h2>
        <Link href="/admin/configuracoes/usuarios">
          Gerenciar usuários
        </Link>
      </section>
    </>
  );
}
