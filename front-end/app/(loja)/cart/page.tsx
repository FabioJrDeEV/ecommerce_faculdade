"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarrinho } from "@/lib/carrinho";

export default function CartPage() {
  const { itens, totalPreco, totalItens, remover, atualizarQuantidade, limpar } =
    useCarrinho();

  return (
    <main className="w-full mx-auto max-w-7xl px-4 py-8 flex-1">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meu Carrinho</h1>

      {itens.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <p className="text-gray-500 text-lg">
            Seu carrinho está vazio.
          </p>
          <Link
            href="/"
            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ver produtos
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {itens.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={item.imagem}
                    alt={item.nome}
                    fill
                    sizes="80px"
                    className="object-cover rounded-md"
                    unoptimized
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-sm text-gray-500">{item.nome}</span>
                  <p className="font-bold text-blue-600 mt-1">
                    R${" "}
                    {item.preco.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      atualizarQuantidade(item.id, item.quantidade - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-700">
                    {item.quantidade}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      atualizarQuantidade(item.id, item.quantidade + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <p className="font-semibold text-gray-800 text-center sm:text-right sm:w-24">
                  R${" "}
                  {(item.preco * item.quantidade).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => remover(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold cursor-pointer"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-gray-200 rounded-lg p-6">
            <button
              type="button"
              onClick={limpar}
              className="text-red-500 hover:text-red-700 text-sm font-semibold cursor-pointer"
            >
              Limpar carrinho
            </button>
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-500">
                {totalItens} {totalItens === 1 ? "item" : "itens"}
              </p>
              <p className="text-xl font-bold text-gray-800">
                Total: R${" "}
                {totalPreco.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <Link
              href="/checkout"
              className="bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer inline-block text-center"
            >
              Finalizar compra
            </Link>
          </div>
        </>
      )}
    </main>
  );
}