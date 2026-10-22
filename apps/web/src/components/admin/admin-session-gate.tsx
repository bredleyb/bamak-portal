"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Notification } from "../ui/notification";

type AdminRole = "ADMINISTRATOR" | "OPERATOR";

type AdminIdentity = {
  userId: string;
  role: AdminRole;
};

type GateStatus =
  | "checking"
  | "allowed"
  | "denied"
  | "unavailable";

type AdminSessionGateProps = Readonly<{
  children: ReactNode;
}>;

function isAdminIdentity(value: unknown): value is AdminIdentity {
  if (!value || typeof value !== "object") {
    return false;
  }

  const identity = value as Record<string, unknown>;

  return (
    typeof identity.userId === "string" &&
    identity.userId.trim().length > 0 &&
    (identity.role === "ADMINISTRATOR" ||
      identity.role === "OPERATOR")
  );
}

export function AdminSessionGate({
  children,
}: AdminSessionGateProps) {
  const { replace } = useRouter();

  const [status, setStatus] = useState<GateStatus>("checking");

  useEffect(() => {
    let active = true;

    async function verifyAccess() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        if (active) {
          setStatus("unavailable");
        }

        return;
      }

      try {
        const response = await fetch(
          `${apiUrl.replace(/\/$/, "")}/auth/me`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
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
          setStatus("denied");
          return;
        }

        if (!response.ok) {
          setStatus("unavailable");
          return;
        }

        const identity: unknown = await response.json();

        if (!active) {
          return;
        }

        if (!isAdminIdentity(identity)) {
          setStatus("denied");
          return;
        }

        setStatus("allowed");
      } catch {
        // Nao expor detalhes internos da API ou da rede.
        if (active) {
          setStatus("unavailable");
        }
      }
    }

    void verifyAccess();

    return () => {
      // Impede respostas atrasadas de liberarem uma tela desmontada.
      active = false;
    };
  }, [replace]);

  if (status === "allowed") {
    return <>{children}</>;
  }

  if (status === "checking") {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <p
          role="status"
          className="text-sm text-content-secondary"
        >
          Verificando acesso…
        </p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <Notification
          tone="danger"
          title="Acesso negado"
          description="Sua conta não possui permissão para acessar esta área."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <Notification
        tone="warning"
        title="Não foi possível verificar o acesso"
        description="Verifique sua conexão e tente novamente."
      />
    </div>
  );
}