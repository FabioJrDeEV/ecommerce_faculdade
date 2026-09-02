"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCarrinho } from "@/lib/carrinho";

function CartContent() {
  const {
    itens,
    totalPreco,
    totalItens,
    remover,
    atualizarQuantidade,
    limpar,
  } = useCarrinho();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sucesso = searchParams.get("sucesso") === "1";
  const cancelado = searchParams.get("cancelado") === "1";

  useEffect(() => {
    if (sucesso && itens.length > 0) {
      limpar();
    }
  }, [sucesso, limpar, itens.length]);

  function fecharSucesso() {
    router.replace("/cart");
  }

  return (
    <main className="w-full mx-auto max-w-7xl px-4 py-8 flex-1">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meu Carrinho</h1>

      {sucesso && (
        <div
          className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          role="status"
        >
          <div>
            <h2 className="text-lg font-semibold text-green-800">
              Compra finalizada com sucesso!
            </h2>
            <p className="text-sm text-green-700 mt-1">
              Obrigado pela sua compra. Adoraríamos ouvir sua opinião sobre a
              experiência.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/avaliar"
              className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors text-center"
            >
              Avaliar agora
            </Link>
            <button
              type="button"
              onClick={fecharSucesso}
              className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer px-4 py-2"
            >
              Depois
            </button>
          </div>
        </div>
      )}

      {cancelado && (
        <div
          className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800"
          role="status"
        >
          Pagamento cancelado. Seus itens continuam no carrinho.
        </div>
      )}

      {itens.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <p className="text-gray-500 text-lg">Seu carrinho está vazio.</p>
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

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <main className="w-full mx-auto max-w-7xl px-4 py-8 flex-1">
          <p className="text-gray-500">Carregando...</p>
        </main>
      }
    >
      <CartContent />
    </Suspense>
  );
}
