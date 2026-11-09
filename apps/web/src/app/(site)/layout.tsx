import type { ReactNode } from "react";
import { SiteHeader } from "../../components/layout/site-header";
import { SiteFooter } from "../../components/layout/site-footer";

export default function SiteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <div
        id="conteudo-principal"
        tabIndex={-1}
        className="flex-1 bamak-site-content"
      >
        {children}
      </div>
      <SiteFooter />
    </>
  );
}