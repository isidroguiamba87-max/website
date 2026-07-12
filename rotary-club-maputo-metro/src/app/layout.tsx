import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { MessageModalProvider } from "@/components/MessageModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lora",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Rotary Club of Maputo Metro — Pessoas de Ação, a Servir com Propósito",
  description:
    "O Rotary Club of Maputo Metro (Distrito 9400) é um clube vibrante de líderes, profissionais e voluntários dedicados, unidos pelo compromisso de criar mudanças positivas e duradouras em Maputo e em todo o Moçambique.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body className={`${lora.variable} ${inter.variable}`}>
        <LanguageProvider>
          <MessageModalProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </MessageModalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
