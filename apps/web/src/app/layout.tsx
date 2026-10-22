import type { Metadata } from "next";
import { Archivo, Source_Sans_3 } from "next/font/google";


import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal Bamak | Bamak Equipamentos",
  description:
    "Portal institucional da Bamak Equipamentos: aplicações, catálogo e canais de contato.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${sourceSans3.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
