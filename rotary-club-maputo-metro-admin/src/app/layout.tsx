import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Painel de Administração — Rotary Club of Maputo Metro",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-neutral-50 text-neutral-900">{children}</body>
    </html>
  );
}
