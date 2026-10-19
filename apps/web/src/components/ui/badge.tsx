import "./badge.css";

export type BadgeStatus =
  | "neutral"
  | "new"
  | "in-review"
  | "done";

export type BadgeProps = Readonly<{
  label: string;
  status?: BadgeStatus;
  className?: string;
}>;

export function Badge({
  label,
  status = "neutral",
  className,
}: BadgeProps) {
  const classes = [
    "bamak-badge",
    `bamak-badge--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{label}</span>;
}
