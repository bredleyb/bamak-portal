"use client";

import { useId } from "react";
import "./notification.css";

export type NotificationTone =
  | "info"
  | "success"
  | "warning"
  | "danger";

export type NotificationProps = Readonly<{
  title: string;
  description: string;
  tone?: NotificationTone;
  className?: string;
}>;

export function Notification({
  title,
  description,
  tone = "info",
  className,
}: NotificationProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;

  const role =
    tone === "warning" || tone === "danger"
      ? "alert"
      : "status";

  const classes = [
    "bamak-notification",
    `bamak-notification--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role={role}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="bamak-notification__content">
        <p
          id={titleId}
          className="bamak-notification__title"
        >
          {title}
        </p>

        <p
          id={descriptionId}
          className="bamak-notification__description"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
