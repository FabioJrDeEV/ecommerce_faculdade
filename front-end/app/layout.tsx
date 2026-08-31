import type { Metadata } from "next";
import "./globals.css";
import { CarrinhoProvider } from "@/lib/carrinho";
import { AuthProvider } from "@/lib/auth";

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
        <AuthProvider>
          <CarrinhoProvider>{children}</CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
