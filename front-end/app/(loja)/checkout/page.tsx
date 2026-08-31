"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCarrinho } from "@/lib/carrinho";
import { checkoutSchema, type CheckoutData } from "@/lib/validacoes";

export default function CheckoutPage() {
  const { itens, totalPreco, totalItens } = useCarrinho();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (dados: CheckoutData) => {
    console.log(dados);
  };

  if (itens.length === 0) {
    return (
      <main className="w-full mx-auto max-w-7xl px-4 py-8 flex-1">
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <p className="text-gray-500 text-lg">Seu carrinho está vazio.</p>
          <Link
            href="/"
            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ver produtos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full mx-auto max-w-7xl px-4 py-8 flex-1">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finalizar compra</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col lg:flex-row gap-8"
      >
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Dados de entrega</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Seu nome"
                  {...register("nome")}
                  className={`border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                    errors.nome ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.nome && (
                  <p className="text-xs text-red-500">{errors.nome.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className={`border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="endereco" className="text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <input
                  id="endereco"
                  type="text"
                  placeholder="Rua, número, complemento"
                  {...register("endereco")}
                  className={`border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                    errors.endereco ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.endereco && (
                  <p className="text-xs text-red-500">{errors.endereco.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                    Cidade
                  </label>
                  <input
                    id="cidade"
                    type="text"
                    placeholder="Cidade"
                    {...register("cidade")}
                    className={`border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                      errors.cidade ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.cidade && (
                    <p className="text-xs text-red-500">{errors.cidade.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="estado" className="text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <input
                    id="estado"
                    type="text"
                    placeholder="UF"
                    {...register("estado")}
                    className={`border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                      errors.estado ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.estado && (
                    <p className="text-xs text-red-500">{errors.estado.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="cep" className="text-sm font-medium text-gray-700">
                    CEP
                  </label>
                  <input
                    id="cep"
                    type="text"
                    placeholder="00000-000"
                    {...register("cep")}
                    className={`border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                      errors.cep ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.cep && (
                    <p className="text-xs text-red-500">{errors.cep.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Resumo do pedido</h2>
            <ul className="flex flex-col gap-2 mb-4">
              {itens.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.nome} × {item.quantidade}
                  </span>
                  <span>
                    R${" "}
                    {(item.preco * item.quantidade).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="text-sm text-gray-500">
                {totalItens} {totalItens === 1 ? "item" : "itens"}
              </span>
              <span className="font-bold text-lg text-blue-600">
                R${" "}
                {totalPreco.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Ir para pagamento
          </button>
          <Link
            href="/cart"
            className="text-center text-sm text-gray-500 hover:text-gray-700"
          >
            Voltar ao carrinho
          </Link>
        </div>
      </form>
    </main>
  );
}