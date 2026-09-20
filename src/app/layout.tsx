import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fredoka";
import "@fontsource-variable/nunito";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { carregarConfig, listarBrinquedos, listarCategorias } from "@/lib/dados";
import { secoesDoCatalogo } from "@/lib/catalogo";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const DESCRICAO =
  "Locação de brinquedos para festas e eventos. Veja as datas livres na hora e peça sua cotação pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "BrincaFácil | Locação de brinquedos", template: "%s | BrincaFácil" },
  description: DESCRICAO,
  applicationName: "BrincaFácil",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "BrincaFácil",
    title: "BrincaFácil | Locação de brinquedos",
    description: DESCRICAO,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BrincaFácil" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
};

export const viewport: Viewport = {
  themeColor: "#082872",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [config, brinquedos, categorias] = await Promise.all([
    carregarConfig(),
    listarBrinquedos(),
    listarCategorias(),
  ]);
  // Só entram no menu as categorias que têm itens publicados.
  const menu = secoesDoCatalogo(brinquedos, categorias).map((s) => ({ nome: s.nome, slug: s.slug }));

  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        <Header whatsapp={config.whatsapp} mensagem={config.mensagemGeral} categorias={menu} />
        <main>{children}</main>
        <Footer whatsapp={config.whatsapp} mensagem={config.mensagemGeral} />
      </body>
    </html>
  );
}
