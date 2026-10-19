"use client";

import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import "./select.css";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "multiple" | "size"
> & {
  label: string;
  options: readonly SelectOption[];
  hint?: string;
  error?: string;
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      options,
      hint,
      error,
      placeholder = "Selecione uma opção",
      id,
      className,
      value,
      defaultValue,
      "aria-describedby": externalDescription,
      "aria-invalid": externalInvalid,
      ...selectProps
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = `${selectId}-hint`;
    const errorId = `${selectId}-error`;

    const describedBy =
      [
        externalDescription,
        hint ? hintId : undefined,
        error ? errorId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const classes = [
      "bamak-select",
      error && "bamak-select--error",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={classes}>
        <label
          className="bamak-select__label"
          htmlFor={selectId}
        >
          {label}
        </label>

        <div className="bamak-select__control">
          <select
            {...selectProps}
            ref={ref}
            id={selectId}
            className="bamak-select__input"
            value={value}
            defaultValue={
              value === undefined
                ? (defaultValue ?? "")
                : undefined
            }
            aria-invalid={error ? true : externalInvalid}
            aria-describedby={describedBy}
          >
            <option value="" disabled>
              {placeholder}
            </option>

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <span
            className="bamak-select__chevron"
            aria-hidden="true"
          >
            <ChevronDown size={20} strokeWidth={2} />
          </span>
        </div>

        {hint && (
          <p
            id={hintId}
            className="bamak-select__hint"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="bamak-select__error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
