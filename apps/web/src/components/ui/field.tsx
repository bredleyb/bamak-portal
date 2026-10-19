"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from "react";
import "./field.css";

export type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  function Field(
    {
      label,
      hint,
      error,
      id,
      className,
      readOnly = false,
      disabled = false,
      "aria-describedby": externalDescription,
      "aria-invalid": externalInvalid,
      ...inputProps
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const describedBy =
      [
        externalDescription,
        hint ? hintId : undefined,
        error ? errorId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const classes = [
      "bamak-field",
      error && "bamak-field--error",
      readOnly && "bamak-field--readonly",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={classes}>
        <label
          className="bamak-field__label"
          htmlFor={inputId}
        >
          {label}
        </label>

        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          className="bamak-field__input"
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error ? true : externalInvalid}
          aria-describedby={describedBy}
        />

        {hint && (
          <p
            id={hintId}
            className="bamak-field__hint"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="bamak-field__error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Field.displayName = "Field";
