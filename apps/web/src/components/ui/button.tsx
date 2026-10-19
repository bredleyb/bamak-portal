"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "small" | "medium";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "small",
      loading = false,
      disabled = false,
      type = "button",
      className,
      children,
      ...props
    },
    ref,
  ) {
    const classes = [
      "bamak-button",
      `bamak-button--${variant}`,
      `bamak-button--${size}`,
      loading && "bamak-button--loading",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        <span className="bamak-button__label">{children}</span>

        {loading && (
          <span
            className="bamak-button__spinner"
            aria-hidden="true"
          />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
