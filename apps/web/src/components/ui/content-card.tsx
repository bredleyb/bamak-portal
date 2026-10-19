import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import "./content-card.css";

export type ContentCardType =
  | "application"
  | "product"
  | "publication";

export type ContentCardImage = {
  src: string;
  alt: string;
};

export type ContentCardProps = Readonly<{
  type: ContentCardType;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  image?: ContentCardImage;
  className?: string;
}>;

const placeholders = {
  application: {
    label: "Fotografia de aplicação",
    src: "/assets/placeholders/imagem-reservada-wide.svg",
    width: 54,
    height: 42,
  },
  product: {
    label: "Fotografia de produto",
    src: "/assets/placeholders/imagem-reservada-product.svg",
    width: 72,
    height: 56,
  },
  publication: {
    label: "Imagem de publicação",
    src: "/assets/placeholders/imagem-reservada-wide.svg",
    width: 54,
    height: 42,
  },
} as const;

export function ContentCard({
  type,
  title,
  description,
  actionLabel,
  href,
  image,
  className,
}: ContentCardProps) {
  const placeholder = placeholders[type];
  const ratio = type === "product" ? "product" : "wide";

  const classes = [
    "bamak-content-card",
    `bamak-content-card--${type}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classes}>
      <div
        className={[
          "bamak-content-card__media",
          `bamak-content-card__media--${ratio}`,
        ].join(" ")}
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 390px) 100vw, 352px"
            className="bamak-content-card__image"
          />
        ) : (
          <div className="bamak-content-card__placeholder">
            <Image
              src={placeholder.src}
              alt=""
              aria-hidden="true"
              width={placeholder.width}
              height={placeholder.height}
              className="bamak-content-card__placeholder-icon"
            />

            <span className="bamak-content-card__placeholder-label">
              {placeholder.label}
            </span>
          </div>
        )}
      </div>

      <div className="bamak-content-card__content">
        <h3 className="bamak-content-card__title">
          {title}
        </h3>

        <p className="bamak-content-card__description">
          {description}
        </p>

        <Link
          href={href}
          className="bamak-content-card__action"
        >
          <span>{actionLabel}</span>
          <ArrowRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
