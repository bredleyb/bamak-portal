import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NewsCarousel, { type HomePublication } from "./news-carousel";

type HomeNewsSectionProps = Readonly<{
  publications: readonly HomePublication[];
}>;

// HOME-COM-07: a seção depende apenas das publicações recebidas.
// A consulta e a filtragem por status publicado pertencem à Issue #101.
export default function HomeNewsSection({ publications }: HomeNewsSectionProps) {
  const hasPublications = publications.length > 0;

  return (
    <section
      className={`bamak-home__news${hasPublications ? " bamak-home__news--populated" : ""}`}
      aria-labelledby="home-news-title"
    >
      <div className="bamak-home__container">
        <h2 id="home-news-title" className="bamak-home__news-title">
          Notícias e agenda
        </h2>
        {hasPublications ? (
          <>
            <NewsCarousel publications={publications} />
            <Link className="bamak-home__news-all" href="/comunicacao">
              Ver todas as publicações
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </>
        ) : (
          <div className="bamak-home__news-empty">
            <p>
              Acompanhe notícias, eventos, feiras e comunicados da Bamak. As
              publicações aparecerão aqui quando forem disponibilizadas.
            </p>
            <Link className="bamak-home__text-link" href="/comunicacao">
              <span>Conhecer a área de Comunicação</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
