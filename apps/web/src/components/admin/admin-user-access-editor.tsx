"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Notification } from "../ui/notification";
import { AdminRolePicker } from "./admin-role-picker";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMINISTRATOR" | "OPERATOR";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Role = AdminUser["role"];
type AccessChange =
  | { kind: "role"; role: Role }
  | { kind: "active"; isActive: boolean };

type Props = Readonly<{
  user: AdminUser;
  isOwnAccount: boolean;
  onUpdated: () => void;
}>;

function validUpdatedUser(
  value: unknown,
  current: AdminUser,
  change: AccessChange,
): boolean {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (!record.user || typeof record.user !== "object") return false;
  const updated = record.user as Record<string, unknown>;

  return (
    updated.id === current.id &&
    updated.name === current.name &&
    updated.email === current.email &&
    (updated.role === "ADMINISTRATOR" || updated.role === "OPERATOR") &&
    typeof updated.isActive === "boolean" &&
    updated.role === (change.kind === "role" ? change.role : current.role) &&
    updated.isActive ===
      (change.kind === "active" ? change.isActive : current.isActive) &&
    typeof updated.createdAt === "string" &&
    !Number.isNaN(Date.parse(updated.createdAt)) &&
    typeof updated.updatedAt === "string" &&
    !Number.isNaN(Date.parse(updated.updatedAt))
  );
}

export function AdminUserAccessEditor({
  user,
  isOwnAccount,
  onUpdated,
}: Props) {
  const { replace } = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);
  const [confirmation, setConfirmation] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inFlight = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);


  function openEditor() {
    setSelectedRole(user.role);
    setError(null);
    setSuccess(null);
    setConfirmation(null);
    setOpen(true);
  }

  function closeEditor() {
    if (inFlight.current) return;
    setConfirmation(null);
    setError(null);
    setOpen(false);
    triggerRef.current?.focus();
  }

  async function submitChange(change: AccessChange) {
    if (inFlight.current || isOwnAccount) return;

    setError(null);
    setSuccess(null);
    inFlight.current = true;
    setBusy(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("API indisponível");

      const endpoint = change.kind === "role" ? "role" : "active";
      const body = change.kind === "role"
        ? { role: change.role }
        : { isActive: change.isActive };

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/users/${encodeURIComponent(user.id)}/${endpoint}`,
        {
          method: "PATCH",
          credentials: "include",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (response.status === 401) {
        replace("/admin/login");
        return;
      }
      if (response.status === 403) {
        setError("Você não tem permissão para alterar este acesso.");
        return;
      }
      if (response.status === 404) {
        setError("Conta não encontrada. Atualize a listagem.");
        return;
      }
      if (response.status === 409) {
        setError("A alteração foi impedida para preservar um administrador ativo.");
        return;
      }
      if (!response.ok) {
        setError("Não foi possível atualizar o acesso. Tente novamente.");
        return;
      }

      const payload: unknown = await response.json();
      if (!validUpdatedUser(payload, user, change)) {
        setError("Não foi possível confirmar a alteração. Atualize a listagem.");
        return;
      }

      setConfirmation(null);
      setOpen(false);
      setSuccess(
        change.kind === "role"
          ? "Perfil atualizado com sucesso."
          : change.isActive
            ? "Acesso reativado com sucesso."
            : "Acesso desativado com sucesso.",
      );
      onUpdated();
      triggerRef.current?.focus();
    } catch {
      setError("Não foi possível atualizar o acesso. Tente novamente.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="bamak-admin-users__access-editor">
      <button
        ref={triggerRef}
        type="button"
        className="bamak-admin-users__review"
        disabled={isOwnAccount || busy}
        aria-expanded={open}
        title={isOwnAccount ? "Sua própria conta está protegida nesta tela" : undefined}
        onClick={open ? closeEditor : openEditor}
      >
        {open ? "Fechar revisão" : "Revisar permissões"}
      </button>

      {success && !open && <p role="status" className="bamak-admin-users__access-feedback">{success}</p>}

      {open && (
        <section
          aria-label={`Permissões de ${user.name}`}
          className="bamak-admin-users__access-panel"
          aria-busy={busy}
        >
          <AdminRolePicker
            label="Perfil de acesso"
            value={selectedRole}
            onValueChange={setSelectedRole}
            disabled={busy || confirmation !== null}
            autoFocus
          />
          <div className="bamak-admin-users__access-actions">
            <Button
              variant="primary"
              size="medium"
              disabled={busy || confirmation !== null || selectedRole === user.role}
              loading={busy}
              onClick={() => void submitChange({ kind: "role", role: selectedRole })}
            >
              Salvar perfil
            </Button>
            <Button
              variant="secondary"
              size="medium"
              disabled={busy}
              onClick={closeEditor}
            >
              Cancelar
            </Button>
          </div>

          <div className="bamak-admin-users__access-status">
            <p>Situação atual: {user.isActive ? "Ativo" : "Inativo"}</p>
            {confirmation === null ? (
              <Button
                variant="secondary"
                size="medium"
                disabled={busy}
                onClick={() => setConfirmation(!user.isActive)}
              >
                {user.isActive ? "Desativar acesso" : "Reativar acesso"}
              </Button>
            ) : (
              <div className="bamak-admin-users__access-confirmation">
                <p>
                  {confirmation
                    ? "Confirma a reativação desta conta?"
                    : "Confirma a desativação? A conta perderá acesso nas próximas requisições."}
                </p>
                <div className="bamak-admin-users__access-actions">
                  <Button
                    variant="primary"
                    size="medium"
                    disabled={busy}
                    loading={busy}
                    onClick={() => void submitChange({ kind: "active", isActive: confirmation })}
                  >
                    {confirmation ? "Confirmar reativação" : "Confirmar desativação"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="medium"
                    disabled={busy}
                    onClick={() => setConfirmation(null)}
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <Notification
              tone="danger"
              title="Não foi possível alterar o acesso"
              description={error}
            />
          )}
        </section>
      )}
    </div>
  );
}
