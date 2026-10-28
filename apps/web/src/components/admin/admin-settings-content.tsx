export function AdminSettingsContent() {
  return (
    <>
      <div className="bamak-admin-overview__intro">
        <p className="bamak-admin-overview__eyebrow">
          CONFIGURAÇÕES
        </p>
        <h1>Configurações essenciais</h1>
        <p className="bamak-admin-overview__description">
          Acesso à conta, usuários e parâmetros operacionais da administração.
        </p>
      </div>

      <section
        className="bamak-admin-settings__card"
        aria-labelledby="admin-settings-security-title"
      >
        <h2 id="admin-settings-security-title">
          Segurança da conta
        </h2>
        <p>
          Alteração de senha e encerramento de sessões precisam
          confirmar a identidade do usuário autenticado.
        </p>
        <button type="button" disabled>
          Alterar senha
        </button>
      </section>

      <section
        className="bamak-admin-settings__card"
        aria-labelledby="admin-settings-notifications-title"
      >
        <h2 id="admin-settings-notifications-title">
          Envio de notificações
        </h2>
        <p>
          Destinatários e configuração do serviço dependem da
          validação com a Bamak. Não expor credenciais do provedor.
        </p>
        <div className="bamak-admin-settings__field">
          <label htmlFor="admin-settings-recipient">
            Endereço institucional
          </label>
          <input
            id="admin-settings-recipient"
            type="email"
            disabled
            placeholder="Destinatário interno autorizado"
          />
        </div>
        <p>
          Situação de envio: configuração ainda não disponível.
        </p>
      </section>

      <section
        className="bamak-admin-settings__card"
        aria-labelledby="admin-settings-users-title"
      >
        <h2 id="admin-settings-users-title">
          Usuários e permissões
        </h2>
        <p>
          Criação, desativação e perfil de acesso são operações
          restritas ao Administrador.
        </p>
        <button type="button" disabled>
          Gerenciar usuários
        </button>
      </section>
    </>
  );
}
