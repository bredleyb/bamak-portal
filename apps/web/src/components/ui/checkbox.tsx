"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from "react";
import { Check } from "lucide-react";
import "./checkbox.css";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps
>(function Checkbox(
  {
    label,
    hint,
    error,
    id,
    className,
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
    "bamak-checkbox",
    error && "bamak-checkbox--error",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="bamak-checkbox__row">
        <span className="bamak-checkbox__control">
          <input
            {...inputProps}
            ref={ref}
            id={inputId}
            type="checkbox"
            className="bamak-checkbox__input"
            disabled={disabled}
            aria-invalid={error ? true : externalInvalid}
            aria-describedby={describedBy}
          />

          <Check
            className="bamak-checkbox__check"
            size={16}
            strokeWidth={3}
            aria-hidden="true"
          />
        </span>

        <label
          className="bamak-checkbox__label"
          htmlFor={inputId}
        >
          {label}
        </label>
      </div>

      {hint && (
        <p
          id={hintId}
          className="bamak-checkbox__hint"
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="bamak-checkbox__error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";
