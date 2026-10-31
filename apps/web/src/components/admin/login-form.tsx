"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Notification } from "../ui/notification";
import { isValidAdminEmail } from "./admin-email-validation";
import "./login-form.css";

const errorMessages = {
  invalid: {
    title: "Não foi possível entrar",
    description:
      "Confira as credenciais e tente novamente.",
  },
  rateLimit: {
    title: "Muitas tentativas de acesso",
    description:
      "Aguarde antes de tentar entrar novamente.",
  },
  connection: {
    title: "Não foi possível acessar o serviço",
    description:
      "Tente novamente em instantes.",
  },
  unexpected: {
    title: "Não foi possível concluir o acesso",
    description:
      "Tente novamente em alguns instantes.",
  },
} as const;

type LoginError = keyof typeof errorMessages;

function validateEmail(value: string): string | undefined {
  const normalized = value.trim();

  if (!normalized) {
    return "Informe o e-mail de acesso.";
  }

  if (!isValidAdminEmail(normalized)) {
    return "Informe um e-mail válido.";
  }

  return undefined;
}

type LoginFormProps = Readonly<{
  sessionExpired?: boolean;
}>;

// O HTML inicial nao pode permitir envio antes da hidratacao.
const subscribeHydration = () => () => {};
const getClientHydration = () => true;
const getServerHydration = () => false;

export function LoginForm({
  sessionExpired = false,
}: LoginFormProps) {
  const router = useRouter();

  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getClientHydration,
    getServerHydration,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [attempted, setAttempted] = useState(false);

  const inFlight = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Impede envios simultaneos mesmo antes de o React
    // atualizar o estado visual do botao.
    if (inFlight.current) {
      return;
    }

    setAttempted(true);
    setError(null);

    if (validateEmail(email) || !password.trim()) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setError("connection");
      return;
    }

    inFlight.current = true;
    setSubmitting(true);

    try {
      const response = await fetch(
        `${apiUrl}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      );

      if (response.ok) {
        router.replace("/admin");
        return;
      }

      if (response.status === 401) {
        setError("invalid");
        return;
      }

      if (response.status === 429) {
        setError("rateLimit");
        return;
      }

      setError("unexpected");
    } catch {
      // Nao exibir mensagens internas da API ou do navegador.
      setError("connection");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  const emailError = attempted
    ? validateEmail(email)
    : undefined;

  const passwordError =
    attempted && !password.trim()
      ? "Informe sua senha."
      : undefined;

  const currentError = error
    ? errorMessages[error]
    : sessionExpired
      ? {
          title: "Sua sessão expirou",
          description: "Entre novamente para continuar no painel.",
        }
      : null;

  return (
    <form
      className="bamak-admin-login-form"
      method="post"
      action="/admin/login"
      onSubmit={(event) => void handleSubmit(event)}
      aria-labelledby="admin-login-title"
      noValidate
    >

      <h1
        id="admin-login-title"
        className="bamak-admin-login-form__title"
      >
        Entrar no painel
      </h1>


      {currentError && (
        <Notification
          tone={error === "rateLimit" ? "warning" : error ? "danger" : "info"}
          title={currentError.title}
          description={currentError.description}
        />
      )}

      <div className="bamak-admin-login-form__fields">
        <Field
          label="E-mail"
          name="email"
          type="email"
          value={email}
          error={emailError}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          disabled={submitting}
        />

        <Field
          label="Senha"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          error={passwordError}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          disabled={submitting}
        />
      </div>

      <button
        type="button"
        className="bamak-admin-login-form__show-password"
        onClick={() => setShowPassword((visible) => !visible)}
        disabled={submitting}
        aria-pressed={showPassword}
      >
        {showPassword ? "Ocultar senha" : "Mostrar senha"}
      </button>

      <Button
        type="submit"
        variant="primary"
        size="medium"
        className="bamak-admin-login-form__submit"
        loading={submitting}
        disabled={!hydrated || (attempted && Boolean(emailError || passwordError))}
      >
        {submitting ? "Validando acesso…" : "Entrar no painel"}
      </Button>
    </form>
  );
}