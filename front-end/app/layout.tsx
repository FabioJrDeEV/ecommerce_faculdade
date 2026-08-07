import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/header/page";

export const metadata: Metadata = {
  title: "Loja do Barbeiro",
  description: "O lugar mais completo para sua barbearia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
