"use client";

import {
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Notification } from "../ui/notification";
import "./login-form.css";

const errorMessages = {
  invalid: {
    title: "Credenciais inválidas",
    description:
      "Verifique seu e-mail e senha e tente novamente.",
  },
  rateLimit: {
    title: "Muitas tentativas de acesso",
    description:
      "Aguarde antes de tentar entrar novamente.",
  },
  connection: {
    title: "Não foi possível conectar à API",
    description:
      "Verifique sua conexão e tente novamente.",
  },
  unexpected: {
    title: "Não foi possível concluir o acesso",
    description:
      "Tente novamente em alguns instantes.",
  },
} as const;

type LoginError = keyof typeof errorMessages;

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);

  const inFlight = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Impede envios simultaneos mesmo antes de o React
    // atualizar o estado visual do botao.
    if (inFlight.current) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    setError(null);

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

  const currentError = error
    ? errorMessages[error]
    : null;

  return (
    <form
      className="bamak-admin-login-form"
      onSubmit={(event) => void handleSubmit(event)}
      aria-labelledby="admin-login-title"
    >
      <p className="bamak-admin-login-form__eyebrow">
        ACESSO DA EQUIPE
      </p>

      <h1
        id="admin-login-title"
        className="bamak-admin-login-form__title"
      >
        Entrar no painel
      </h1>

      <p className="bamak-admin-login-form__description">
        Utilize suas credenciais de acesso à área
        administrativa.
      </p>

      {currentError && (
        <Notification
          tone={error === "rateLimit" ? "warning" : "danger"}
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
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu e-mail de acesso"
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
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Informe sua senha"
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
      >
        {submitting ? "Validando acesso..." : "Entrar no painel"}
      </Button>
    </form>
  );
}