import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeNewsSection from "../../components/home/home-news-section";
import type { HomePublication } from "../../components/home/news-carousel";
import "./page.css";

function TextLink({
  href,
  children,
}: Readonly<{
  href: string;
  children: ReactNode;
}>) {
  return (
    <Link className="bamak-home__text-link" href={href}>
      <span>{children}</span>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

function ReservedImage({
  title,
  className = "",
}: Readonly<{
  title: string;
  className?: string;
}>) {
  return (
    <div className={`bamak-home__reserved ${className}`}>
      <Image
        src="/assets/placeholders/imagem-reservada-wide.svg"
        alt=""
        width={80}
        height={62}
        aria-hidden="true"
      />
      <span className="bamak-home__reserved-title">{title}</span>
    </div>
  );
}

// HOME-COM-07: nenhuma publicação real disponível até a integração da #101.
const homePublications: readonly HomePublication[] = [];

export default function Home() {
  return (
    <main className="bamak-home" id="home">
      <section className="bamak-home__hero" aria-labelledby="home-title">
        <div className="bamak-home__container bamak-home__hero-grid">
          <div className="bamak-home__hero-copy">
            <h1 id="home-title">
              Máquinas e equipamentos para a&nbsp;indústria e o&nbsp;agronegócio
            </h1>
            <p className="bamak-home__lead">
              Com sede em Schroeder (SC), a Bamak desenvolve e fabrica equipamentos
              para os setores metalúrgico, alimentício, têxtil e agrícola, além de
              sistemas de cabo aéreo e acessórios para instalação de redes de
              eletrificação.
            </p>
            <div className="bamak-home__hero-actions">
              <Link
                className="bamak-home__button bamak-home__button--primary"
                href="/aplicacoes"
              >
                Conhecer aplicações
              </Link>
              <Link
                className="bamak-home__button bamak-home__button--secondary"
                href="/catalogo"
              >
                Ver catálogo
              </Link>
            </div>
          </div>
          <ReservedImage
            title="Máquina ou equipamento"
            className="bamak-home__hero-media"
          />
        </div>
      </section>

      <section className="bamak-home__paths" aria-labelledby="home-paths-title">
        <div className="bamak-home__container">
          <h2 id="home-paths-title" className="bamak-home__section-title">
            Explore as soluções
          </h2>
          <div className="bamak-home__path-list">
            <article className="bamak-home__path">
              <h3>Aplicações</h3>
              <p>
                Conheça os usos dos equipamentos da Bamak em processos industriais,
                na instalação de redes de eletrificação e na agricultura.
              </p>
              <TextLink href="/aplicacoes">Explorar aplicações</TextLink>
            </article>
            <article className="bamak-home__path">
              <h3>Catálogo</h3>
              <p>
                Consulte máquinas, equipamentos, peças e acessórios por categoria.
                Veja suas características e aplicações antes de solicitar
                informações.
              </p>
              <TextLink href="/catalogo">Consultar catálogo</TextLink>
            </article>
          </div>

          <div className="bamak-home__cable bamak-home__cable-grid">
            <ReservedImage
              title="Cabo Aéreo"
              className="bamak-home__cable-media"
            />
            <div className="bamak-home__cable-copy">
              <h3 id="home-cable-title" className="bamak-home__section-title">
                Cabo Aéreo
              </h3>
              <p>
                Em lavouras de banana, o Cabo Aéreo permite transportar cachos
                suspensos até a área de beneficiamento e movimentar insumos pela
                plantação. Cada sistema é projetado considerando as condições do
                terreno e as necessidades da instalação.
              </p>
              <TextLink href="/cabo-aereo">
                Conhecer o Cabo Aéreo e solicitar análise
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      <HomeNewsSection publications={homePublications} />

      <section className="bamak-home__about" aria-labelledby="home-about-title">
        <div className="bamak-home__container bamak-home__about-grid">
          <div className="bamak-home__about-copy">
            <h2 id="home-about-title" className="bamak-home__section-title">
              Nossa trajetória
            </h2>
            <p className="bamak-home__about-description">
              A Bamak Equipamentos surgiu em 1988, em Guaramirim&nbsp;(SC), com o nome
              de Metalúrgica Bamak. Começou com manutenção, usinagem e caldeiraria.
              Em 1990, mudou-se para Schroeder e, mais tarde, passou a desenvolver
              e fabricar máquinas&nbsp;e&nbsp;equipamentos.
            </p>
            <TextLink href="/institucional">Conhecer nossa história</TextLink>
          </div>
          <ReservedImage
            title="Fachada da empresa"
            className="bamak-home__about-media"
          />
        </div>
      </section>

      <section className="bamak-home__contact" aria-labelledby="home-contact-title">
        <div className="bamak-home__container bamak-home__contact-grid">
          <div>
            <h2 id="home-contact-title" className="bamak-home__section-title">
              Fale com a Bamak
            </h2>
            <p>
              Precisa de informações sobre uma máquina, uma peça ou a aplicação
              de algum equipamento? Descreva&nbsp;sua&nbsp;necessidade para a equipe da Bamak.
            </p>
          </div>
          <Link
            className="bamak-home__button bamak-home__button--contact"
            href="/contato"
          >
            Entrar em contato
          </Link>
        </div>
      </section>
    </main>
  );
}
