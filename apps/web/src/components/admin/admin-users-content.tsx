"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminBackLink } from "./admin-back-link";
import { AdminUserCreateForm } from "./admin-user-create-form";
import { AdminUserAccessEditor, type AdminUser } from "./admin-user-access-editor";
import { useAdminIdentity } from "./admin-session-gate";



type UsersState =
  | { status: "loading" }
  | { status: "ready"; users: AdminUser[] }
  | { status: "denied" }
  | { status: "error" };

function isAdminUser(value: unknown): value is AdminUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    user.id.length > 0 &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    (user.role === "ADMINISTRATOR" ||
      user.role === "OPERATOR") &&
    typeof user.isActive === "boolean" &&
    typeof user.createdAt === "string" &&
    typeof user.updatedAt === "string"
  );
}

function isUsersResponse(
  value: unknown,
): value is { users: AdminUser[] } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const users = (value as Record<string, unknown>).users;

  return Array.isArray(users) && users.every(isAdminUser);
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function AdminUsersContent() {
  const { replace } = useRouter();
  const { userId: currentUserId } = useAdminIdentity();

  const [listState, setListState] = useState<UsersState>({
    status: "loading",
  });
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadUsers() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        if (active) {
          setListState({ status: "error" });
        }
        return;
      }

      try {
        const response = await fetch(
          `${apiUrl.replace(/\/$/, "")}/admin/users`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!active) {
          return;
        }

        if (response.status === 401) {
          replace("/admin/login");
          return;
        }

        if (response.status === 403) {
          setListState({ status: "denied" });
          return;
        }

        if (!response.ok) {
          setListState({ status: "error" });
          return;
        }

        const payload: unknown = await response.json();

        if (!active) {
          return;
        }

        if (!isUsersResponse(payload)) {
          setListState({ status: "error" });
          return;
        }

        setListState({
          status: "ready",
          users: payload.users,
        });
      } catch {
        // Não expor informações internas da conexão ou da API.
        if (active) {
          setListState({ status: "error" });
        }
      }
    }

    void loadUsers();

    return () => {
      active = false;
      controller.abort();
    };
  }, [replace, refreshVersion]);

  return (
    <>
      <div className="bamak-admin-overview__intro">
        <div className="bamak-admin-overview__section-row">
          <AdminBackLink page="users" />
          <p className="bamak-admin-overview__eyebrow">
            CONFIGURAÇÕES
          </p>
        </div>
        <h1>Usuários e acessos</h1>
      </div>


      <section
        className="bamak-admin-settings__card bamak-admin-users__card"
        aria-labelledby="admin-users-list-title"
      >
        <h2 id="admin-users-list-title">
          Acessos cadastrados
        </h2>
        {listState.status === "loading" && (
          <p role="status">Carregando usuários…</p>
        )}

        {listState.status === "denied" && (
          <p role="alert">
            Acesso negado ao consultar usuários.
          </p>
        )}

        {listState.status === "error" && (
          <p role="alert">
            Não foi possível carregar os usuários.
          </p>
        )}

        {listState.status === "ready" &&
          listState.users.length === 0 && (
            <p role="status">Nenhum acesso cadastrado.</p>
          )}

        {listState.status === "ready" &&
          listState.users.length > 0 && (
            <ul className="bamak-admin-users__list">
              {listState.users.map((user) => (
                <li
                  key={user.id}
                  className="bamak-admin-users__list-item"
                >
                  <div className="bamak-admin-users__identity">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>

                  <div className="bamak-admin-users__details">
                    <span>
                      {user.role === "ADMINISTRATOR"
                        ? "Administrador"
                        : "Operador"}
                    </span>
                    <span
                      className={
                        user.isActive
                          ? "bamak-admin-users__status bamak-admin-users__status--active"
                          : "bamak-admin-users__status bamak-admin-users__status--inactive"
                      }
                    >
                      {user.isActive ? "Ativo" : "Inativo"}
                    </span>
                    <time
                      className="bamak-admin-users__updated"
                      dateTime={user.updatedAt}
                    >
                      Última alteração: {formatUpdatedAt(user.updatedAt)}
                    </time>
                  </div>

                  <AdminUserAccessEditor
                    user={user}
                    isOwnAccount={user.id === currentUserId}
                    onUpdated={() => {
                      setRefreshVersion((version) => version + 1);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
      </section>

      <section
        className="bamak-admin-settings__card bamak-admin-users__card"
        aria-label="Administração de usuários"
      >
        <AdminUserCreateForm
          onCreated={() => {
            setRefreshVersion((version) => version + 1);
          }}
        />
      </section>
    </>
  );
}
