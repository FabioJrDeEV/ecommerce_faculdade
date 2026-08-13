"use client";

import { User, ShoppingCart, Menu } from "@deemlol/next-icons";
import Link from "next/link";
import { useState } from "react";
import { produtos } from "@/lib/produtos";
import BuscarInput from "../buscarInput/BuscarInput";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [busca, setBusca] = useState("");

  const sugestoes = busca.trim()
    ? produtos
        .filter((p) =>
          p.nome.toLowerCase().includes(busca.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  return (
    <header className="w-full border border-gray-300">
      <div className="flex w-full mx-auto max-w-7xl justify-between items-center gap-4 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center">
          <h1 className="font-bold text-base sm:text-lg" style={{ color: "#008ECC" }}>
            Loja do Barbeiro
          </h1>
        </div>
        {/* Busca desktop */}
        <div className="hidden md:block flex-1 max-w-lg mx-auto">
          <BuscarInput busca={busca} onBusca={setBusca} sugestoes={sugestoes} />
        </div>
        {/* Ícones desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User size={24} style={{ color: "#008ECC" }} />
            <Link href="/login" className="text-gray-600 text-sm font-semibold">
              Entrar/Registrar
            </Link>
          </div>
          <span className="h-5.5 border border-gray-300"></span>
          <div className="flex items-center gap-2">
            <ShoppingCart size={24} style={{ color: "#008ECC" }} />
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
                <BuscarInput busca={busca} onBusca={setBusca} sugestoes={sugestoes} />
                <div className="flex items-center mt-4">
                  <User
                    size={24}
                    className="shrink-0"
                    style={{ color: "#008ECC" }}
                  />
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-gray-600 text-sm font-semibold"
                  >
                    Entrar/Registrar
                  </Link>
                </div>
                <div className="flex items-center">
                  <ShoppingCart
                    size={24}
                    className="shrink-0"
                    style={{ color: "#008ECC" }}
                  />
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
