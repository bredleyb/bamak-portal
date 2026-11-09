"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import "./news-carousel.css";

// HOME-COM-07: somente dados recebidos do chamador. A origem pública será a #101.
export type HomePublication = Readonly<{
  id: string;
  kind: "noticia" | "agenda" | "evento" | "feira" | "comunicado";
  title: string;
  dateLabel: string;
  href: string;
}>;

type NewsCarouselProps = Readonly<{
  publications: readonly HomePublication[];
}>;

const kindLabels: Record<HomePublication["kind"], string> = {
  noticia: "NOTÍCIA",
  agenda: "AGENDA",
  evento: "EVENTO",
  feira: "FEIRA",
  comunicado: "COMUNICADO",
};

// useSyncExternalStore fornece o mesmo snapshot durante SSR/hidratação e
// acompanha alterações reais de breakpoint ou preferência de movimento.
function subscribeQuery(query: string, listener: () => void) {
  const media = window.matchMedia?.(query);
  media?.addEventListener?.("change", listener);
  return () => media?.removeEventListener?.("change", listener);
}

const subscribeMobile = (listener: () => void) =>
  subscribeQuery("(max-width: 767px)", listener);
const subscribeMotion = (listener: () => void) =>
  subscribeQuery("(prefers-reduced-motion: reduce)", listener);
const readMobile = () =>
  Boolean(window.matchMedia?.("(max-width: 767px)")?.matches);
const readMotion = () =>
  Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
const readServer = () => false;

function actionLabel(kind: HomePublication["kind"]) {
  return kind === "evento" || kind === "feira" || kind === "agenda"
    ? "Ver evento"
    : "Ler publicação";
}

// Cópias visuais para a transição circular: não criam artigos ou destinos
// adicionais na árvore de acessibilidade e ficam fora da ordem de Tab.
type PublicationCardProps = Readonly<{
  publication: HomePublication;
  position: number;
  count: number;
  clone?: boolean;
}>;

function PublicationCard({ publication, position, count, clone = false }: PublicationCardProps) {
  const content = (
    <>
      <div className="bamak-news-carousel__meta">
        <span className="bamak-news-carousel__kind">{kindLabels[publication.kind]}</span>
        <span className="bamak-news-carousel__date">{publication.dateLabel}</span>
      </div>
      <h3 className="bamak-news-carousel__title">{publication.title}</h3>
      <Link
        className="bamak-news-carousel__link"
        href={publication.href}
        tabIndex={clone ? -1 : undefined}
      >
        {actionLabel(publication.kind)}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </>
  );

  if (clone) {
    return (
      <div className="bamak-news-carousel__card" aria-hidden="true">
        {content}
      </div>
    );
  }

  return (
    <article
      data-news-card
      className="bamak-news-carousel__card"
      aria-label={`${position + 1} de ${count}: ${publication.title}`}
    >
      {content}
    </article>
  );
}

export default function NewsCarousel({ publications }: NewsCarouselProps) {
  const count = publications.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const previousIndexRef = useRef(0);
  const directionRef = useRef<"next" | "previous" | null>(null);
  const [index, setIndex] = useState(0);
  const mobile = useSyncExternalStore(subscribeMobile, readMobile, readServer);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, readServer);
  const [playOverride, setPlayOverride] = useState<boolean | null>(null);
  const playing = playOverride ?? (!mobile && !reducedMotion);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const currentIndex = count > 0 ? Math.min(index, count - 1) : 0;

  const scrollToIndex = useCallback(
    (next: number, instant = false) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const firstCard = viewport.querySelector<HTMLElement>("[data-news-card]");
      const secondCard = firstCard?.nextElementSibling as HTMLElement | null;
      const step = firstCard && secondCard
        ? secondCard.offsetLeft - firstCard.offsetLeft
        : firstCard?.getBoundingClientRect().width ?? 0;
      // Há uma cópia do último cartão antes do primeiro cartão real.
      // Com apenas uma publicação, nenhuma cópia é criada.
      const left = Math.max(0, (next + (count > 1 ? 1 : 0)) * step);
      if (typeof viewport.scrollTo === "function") {
        viewport.scrollTo({ left, behavior: instant || reducedMotion ? "auto" : "smooth" });
      } else {
        // jsdom não implementa scrollTo; a seleção permanece testável.
        viewport.scrollLeft = left;
      }
    },
    [count, reducedMotion],
  );

  useEffect(() => {
    const previous = previousIndexRef.current;
    const direction = directionRef.current;
    previousIndexRef.current = currentIndex;
    directionRef.current = null;

    // A passagem usa uma cópia adjacente, depois reposiciona a faixa sem
    // animação. 500 ms excedem a transição prevista (~450 ms no Figma).
    if (count > 1 && direction === "previous" && previous === 0 && currentIndex === count - 1) {
      scrollToIndex(-1);
      const reset = window.setTimeout(() => scrollToIndex(count - 1, true), 500);
      return () => window.clearTimeout(reset);
    }
    if (count > 1 && direction === "next" && previous === count - 1 && currentIndex === 0) {
      scrollToIndex(count);
      const reset = window.setTimeout(() => scrollToIndex(0, true), 500);
      return () => window.clearTimeout(reset);
    }
    scrollToIndex(currentIndex);
  }, [count, currentIndex, scrollToIndex]);

  useEffect(() => {
    if (count < 2 || !playing || pageHidden ||
      (playOverride !== true && (pointerInside || focusInside))) return;
    const interval = window.setInterval(() => {
      directionRef.current = "next";
      setIndex((current) => (current + 1) % count);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [count, playing, pointerInside, focusInside, pageHidden, playOverride]);

  if (count === 0) return null;

  const movable = count > 1;
  return (
    <div
      className="bamak-news-carousel"
      onMouseEnter={() => setPointerInside(true)}
      onMouseLeave={() => setPointerInside(false)}
      onFocusCapture={() => setFocusInside(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusInside(false);
        }
      }}
    >
      <div
        className="bamak-news-carousel__viewport"
        ref={viewportRef}
        aria-label="Publicações da Bamak"
        role="group"
        aria-roledescription="carrossel"
        aria-live="off"
        tabIndex={movable ? 0 : undefined}
      >
        <div className="bamak-news-carousel__track">
          {movable && (
            <PublicationCard
              key={`before-${publications[count - 1].id}`}
              publication={publications[count - 1]}
              position={count - 1}
              count={count}
              clone
            />
          )}
          {publications.map((publication, position) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              position={position}
              count={count}
            />
          ))}
          {movable && Array.from({ length: 4 }, (_, position) => (
            <PublicationCard
              key={`after-${position}-${publications[position % count].id}`}
              publication={publications[position % count]}
              position={position % count}
              count={count}
              clone
            />
          ))}
        </div>
      </div>

      {movable && (
        <div className="bamak-news-carousel__controls" aria-label="Controles do carrossel">
          <button
            className="bamak-news-carousel__arrow"
            type="button"
            aria-label="Publicação anterior"
            onClick={() => {
              directionRef.current = "previous";
              setIndex((current) => (current - 1 + count) % count);
            }}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            className="bamak-news-carousel__toggle"
            type="button"
            aria-label={playing ? "Pausar carrossel" : "Retomar carrossel"}
            onClick={() => {
              setPlayOverride(!playing);
            }}
          >
            {playing ? <Pause size={16} fill="currentColor" aria-hidden="true" /> :
              <Play size={16} fill="currentColor" aria-hidden="true" />}
          </button>
          <span
            className="bamak-news-carousel__position"
            aria-live={playing ? "off" : "polite"}
            aria-atomic="true"
          >
            {currentIndex + 1} de {count}
          </span>
          <button
            className="bamak-news-carousel__arrow"
            type="button"
            aria-label="Próxima publicação"
            onClick={() => {
              directionRef.current = "next";
              setIndex((current) => (current + 1) % count);
            }}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
