import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eden Atelier — Gestão para Designers",
  description: "Sistema completo de gestão para designers de interiores e gráficos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
