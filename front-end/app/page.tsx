"use client";

import { useState } from "react";
import Header from "./_components/header/Header";
import ButtonCategorias from "./_components/buttonCategorias/ButtonCategorias";
import ProductCard from "./_components/productCard/ProductCard";
import { categorias, produtos } from "@/lib/produtos";

export default function App() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(
    categorias[0],
  );

  const produtosFiltrados =
    categoriaSelecionada === "Todos"
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaSelecionada);

  return (
    <>
      <Header />
      <div className="border-b border-gray-300 py-4">
        <div className="flex w-full mx-auto max-w-7xl px-4 gap-3 overflow-x-auto no-scrollbar sm:justify-center">
          {categorias.map((categoria) => (
            <ButtonCategorias
              key={categoria}
              categoria={categoria}
              selecionada={categoriaSelecionada}
              onSelecionar={setCategoriaSelecionada}
            />
          ))}
        </div>
      </div>
      <main className="w-full mx-auto max-w-7xl px-4 py-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {produtosFiltrados.slice(0, 8).map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      </main>
    </>
  );
}
