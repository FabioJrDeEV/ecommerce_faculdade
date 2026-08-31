"use client";

import { User, ShoppingCart, Menu } from "@deemlol/next-icons";
import Link from "next/link";
import { useState } from "react";
import { produtos, normalizar } from "@/lib/produtos";
import { useCarrinho } from "@/lib/carrinho";
import { useAuth } from "@/lib/auth";
import BuscarInput from "../buscarInput/BuscarInput";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [busca, setBusca] = useState("");
  const { totalItens } = useCarrinho();
  const { usuario, logout } = useAuth();

  const sugestoes = busca.trim()
    ? produtos.filter((p) => normalizar(p.nome).includes(normalizar(busca)))
    : [];

  return (
    <header className="w-full border border-gray-300 sticky top-0 z-40 bg-white">
      <div className="flex w-full mx-auto max-w-7xl justify-between items-center gap-4 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center">
          <Link
            href="/"
            className="font-bold text-base sm:text-lg"
            style={{ color: "#008ECC" }}
          >
            Loja do Barbeiro
          </Link>
        </div>
        {/* Busca desktop */}
        <div className="hidden md:block flex-1 max-w-lg mx-auto">
          <BuscarInput busca={busca} onBusca={setBusca} sugestoes={sugestoes} />
        </div>
        {/* Ícones desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User size={24} style={{ color: "#008ECC" }} />
            {usuario ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm font-semibold">
                  {usuario.nome}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-gray-500 text-sm hover:text-red-600 cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 text-sm font-semibold"
              >
                Entrar/Registrar
              </Link>
            )}
          </div>
          <span className="h-5.5 border border-gray-300"></span>
          <div className="flex items-center gap-2 relative">
            <ShoppingCart size={24} style={{ color: "#008ECC" }} />
            {totalItens > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItens}
              </span>
            )}
            <Link href="/cart" className="text-gray-600 text-sm font-semibold">
              Carrinho
            </Link>
          </div>
        </div>
        {/* Menu mobile */}
        <div className="relative flex lg:hidden">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <Menu size={24} style={{ color: "#008ECC" }} />
            {openMenu && (
              <div className="absolute p-4 right-0 mt-5 gap-4 w-64 bg-white border border-gray-300 rounded-sm shadow-lg z-10">
                <div className="flex items-center mt-2">
                  <User
                    size={24}
                    className="shrink-0"
                    style={{ color: "#008ECC" }}
                  />
                  {usuario ? (
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-2 text-gray-600 text-sm font-semibold">
                        {usuario.nome}
                      </span>
                      <button
                        type="button"
                        onClick={logout}
                        className="text-gray-500 text-sm hover:text-red-600 cursor-pointer"
                      >
                        Sair
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-gray-600 text-sm font-semibold"
                    >
                      Entrar/Registrar
                    </Link>
                  )}
                </div>
                <div className="flex items-center">
                  <ShoppingCart
                    size={24}
                    className="shrink-0"
                    style={{ color: "#008ECC" }}
                  />
                  {totalItens > 0 && (
                    <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItens}
                    </span>
                  )}
                  <Link
                    href="/cart"
                    className="block px-4 py-2 text-gray-600 text-sm font-semibold"
                  >
                    Carrinho
                  </Link>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
