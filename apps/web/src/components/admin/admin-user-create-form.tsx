"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Notification } from "../ui/notification";
import { AdminRolePicker } from "./admin-role-picker";

type AdminUserCreateFormProps = Readonly<{
  onCreated: () => void;
}>;

function validateName(value: string): string | undefined {
  const name = value.trim();

  if (!name) {
    return "Informe o nome.";
  }

  if (name.length > 160) {
    return "O nome deve ter no máximo 160 caracteres.";
  }

  return undefined;
}

function validateEmail(value: string): string | undefined {
  const email = value.trim();

  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return "Informe um e-mail válido.";
  }

  if (email.length > 320) {
    return "O e-mail deve ter no máximo 320 caracteres.";
  }

  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (value.length < 12) {
    return "A senha deve ter pelo menos 12 caracteres.";
  }

  if (new Blob([value]).size > 1024) {
    return "A senha ultrapassa o tamanho permitido.";
  }

  return undefined;
}

type ExpectedCreatedUser = {
  name: string;
  email: string;
  role: "ADMINISTRATOR" | "OPERATOR";
};

function isCreatedAdminUserResponse(
  payload: unknown,
  expected: ExpectedCreatedUser,
): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = (payload as Record<string, unknown>).user;

  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const user = candidate as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    user.id.trim().length > 0 &&
    user.name === expected.name &&
    user.email === expected.email &&
    user.role === expected.role &&
    user.isActive === true &&
    typeof user.createdAt === "string" &&
    !Number.isNaN(Date.parse(user.createdAt)) &&
    typeof user.updatedAt === "string" &&
    !Number.isNaN(Date.parse(user.updatedAt))
  );
}
export function AdminUserCreateForm({
  onCreated,
}: AdminUserCreateFormProps) {
  const { replace } = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const inFlight = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const openedBeforeRef = useRef(false);

  useEffect(() => {
    if (open) {
      openedBeforeRef.current = true;
      nameRef.current?.focus();
    } else if (openedBeforeRef.current) {
      triggerRef.current?.focus();
    }
  }, [open]);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setAttempted(false);
    setRequestError(null);
    setOpen(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (inFlight.current) {
      return;
    }

    setAttempted(true);
    setRequestError(null);

    const invalidName = validateName(name);
    const invalidEmail = validateEmail(email);
    const invalidPassword = validatePassword(password);

    if (invalidName || invalidEmail || invalidPassword) {
      if (invalidName) {
        nameRef.current?.focus();
      } else if (invalidEmail) {
        emailRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }

      return;
    }

    const role = new FormData(event.currentTarget).get("role");

    if (role !== "ADMINISTRATOR" && role !== "OPERATOR") {
      setRequestError("Selecione um perfil válido.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setRequestError(
        "Não foi possível criar o usuário. Tente novamente.",
      );
      return;
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    inFlight.current = true;
    setSubmitting(true);

    try {
      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/users`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: normalizedName,
            email: normalizedEmail,
            password,
            role,
          }),
        },
      );

      if (response.ok) {
        const payload: unknown = await response.json();

        if (
          !isCreatedAdminUserResponse(payload, {
            name: normalizedName,
            email: normalizedEmail,
            role,
          })
        ) {
          setRequestError(
            "Não foi possível criar o usuário. Tente novamente.",
          );
          return;
        }

        resetForm();
        onCreated();
        return;
      }

      if (response.status === 401) {
        replace("/admin/login");
        return;
      }

      if (response.status === 403) {
        setRequestError(
          "Você não tem permissão para criar usuários.",
        );
        return;
      }

      if (response.status === 409) {
        setRequestError("Este e-mail já está cadastrado.");
        return;
      }

      setRequestError(
        "Não foi possível criar o usuário. Tente novamente.",
      );
    } catch {
      // Nenhum detalhe de rede, sessão ou erro interno
      // deve ser apresentado ao usuário.
      setRequestError(
        "Não foi possível criar o usuário. Tente novamente.",
      );
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  const nameError = attempted
    ? validateName(name)
    : undefined;

  const emailError = attempted
    ? validateEmail(email)
    : undefined;

  const passwordError = attempted
    ? validatePassword(password)
    : undefined;

  if (!open) {
    return (
      <button
        ref={triggerRef}
        type="button"
        className="bamak-admin-users__add-trigger"
        onClick={() => setOpen(true)}
      >
        Adicionar usuário
      </button>
    );
  }

  return (
    <form
      aria-label="Novo usuário"
      className="bamak-admin-users__create-form"
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      aria-busy={submitting}
    >
      <h2>Novo usuário</h2>

      {requestError && (
        <Notification
          tone="danger"
          title="Não foi possível concluir o cadastro"
          description={requestError}
        />
      )}

      <div className="bamak-admin-users__create-field">
        <Field
          ref={nameRef}
          label="Nome"
          name="name"
          type="text"
          autoComplete="off"
          maxLength={160}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setRequestError(null);
          }}
          error={nameError}
          required
          disabled={submitting}
        />
      </div>

      <div className="bamak-admin-users__create-field">
        <Field
          ref={emailRef}
          label="E-mail"
          name="email"
          type="email"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={320}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setRequestError(null);
          }}
          error={emailError}
          required
          disabled={submitting}
        />
      </div>

      <div className="bamak-admin-users__create-field">
        <Field
          ref={passwordRef}
          label="Senha inicial"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setRequestError(null);
          }}
          error={passwordError}
          required
          disabled={submitting}
        />
      </div>

      <div className="bamak-admin-users__create-field">
        <AdminRolePicker disabled={submitting} />
      </div>

      <div className="bamak-admin-users__create-actions">
        <Button
          type="submit"
          variant="primary"
          size="medium"
          className="bamak-admin-users__create-submit"
          loading={submitting}
          disabled={submitting}
        >
          {submitting ? "Criando usuário…" : "Criar usuário"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="medium"
          className="bamak-admin-users__cancel"
          onClick={resetForm}
          disabled={submitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
