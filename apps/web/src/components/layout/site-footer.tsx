import Image from "next/image";
import Link from "next/link";
import "./site-footer.css";

const companyLinks = [
  { label: "Institucional", href: "/institucional" },
  { label: "Aplicações", href: "/aplicacoes" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Cabo Aéreo", href: "/cabo-aereo" },
] as const;

const informationLinks = [
  { label: "Comunicação", href: "/comunicacao" },
  { label: "Perguntas frequentes", href: "/faq" },
  {
    label: "Política de privacidade",
    href: "/politica-de-privacidade",
  },
] as const;

const socialLinks = [
  {
    label: "Facebook da Bamak",
    href: "https://facebook.com/bamakequipamentos",
    image: "/assets/brand/facebook-white.svg",
    width: 13,
    height: 22,
  },
  {
    label: "Instagram da Bamak",
    href: "https://instagram.com/bamakequipamentos",
    image: "/assets/brand/instagram-white.svg",
    width: 22,
    height: 22,
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bamak-site-footer">
      <div className="bamak-site-footer__inner">
        <div className="bamak-site-footer__columns">
          <div className="bamak-site-footer__identity">
            <Link
              href="/"
              aria-label="Ir para início"
              className="bamak-site-footer__brand"
            >
              <Image
                src="/assets/brand/bamak-lockup-horizontal-white.svg"
                alt="Bamak Equipamentos"
                width={186}
                height={46}
              />
            </Link>

            <p className="bamak-site-footer__company-name">
              Bamak Equipamentos LTDA
            </p>

            <p>
              Equipamentos e peças para atividades agrícolas
            </p>

            <p>Schroeder, Santa Catarina</p>
          </div>

          <nav
            aria-label="Empresa e soluções"
            className="bamak-site-footer__section"
          >
            <h2 className="bamak-site-footer__heading">
              Empresa e soluções
            </h2>

            {companyLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="bamak-site-footer__section">
            <h2 className="bamak-site-footer__heading">
              Atendimento
            </h2>

            <p>WhatsApp · canal comercial</p>

            <a href="tel:+554733741273">
              (47) 3374-1273
            </a>

            <a href="mailto:bamak@bamak.com.br">
              bamak@bamak.com.br
            </a>

            <Link href="/contato">
              Fale com a equipe
            </Link>
          </div>

          <nav
            aria-label="Informações"
            className="bamak-site-footer__section"
          >
            <h2 className="bamak-site-footer__heading">
              Informações
            </h2>

            {informationLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}

            <div className="bamak-site-footer__social">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bamak-site-footer__social-link"
                >
                  <Image
                    src={item.image}
                    alt=""
                    width={item.width}
                    height={item.height}
                  />
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="bamak-site-footer__legal">
          <p>
            © {year} Bamak Equipamentos LTDA
          </p>

          <Link href="/politica-de-privacidade">
            Política de privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
