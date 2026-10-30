"use client";

import { useEffect, useRef, useState } from "react";
import { Field } from "../ui/field";
import { AdminRolePicker } from "./admin-role-picker";

export function AdminUserCreateForm() {
  const [open, setOpen] = useState(false);


  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const openedBeforeRef = useRef(false);

  useEffect(() => {
    if (open) {
      openedBeforeRef.current = true;
      nameRef.current?.focus();
    } else if (openedBeforeRef.current) {
      triggerRef.current?.focus();
    }
  }, [open]);

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
      onSubmit={(event) => event.preventDefault()}
    >
      <h2>Novo usuário</h2>

      <div className="bamak-admin-users__create-field">
        <Field
          ref={nameRef}
          label="Nome"
          name="name"
          type="text"
          autoComplete="off"
          maxLength={160}
          required
        />
      </div>

      <div className="bamak-admin-users__create-field">
        <Field
          label="E-mail"
          name="email"
          type="email"
          autoComplete="off"
          maxLength={320}
          required
        />
      </div>

      <div className="bamak-admin-users__create-field">
        <Field
          label="Senha inicial"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
        />
      </div>

      <div className="bamak-admin-users__create-field">
        <AdminRolePicker />
      </div>

      <div className="bamak-admin-users__create-actions">
        <button
          type="submit"
          disabled
        >
          Criar usuário
        </button>

        <button
          type="button"
          className="bamak-admin-users__cancel"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
