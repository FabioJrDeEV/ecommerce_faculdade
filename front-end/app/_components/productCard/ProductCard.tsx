import type { Produto } from "@/lib/produtos";
import { ShoppingCart } from "@deemlol/next-icons";
import Image from "next/image";

type ProductCardProps = {
  produto: Produto;
};

export default function ProductCard({ produto }: ProductCardProps) {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={produto.imagem}
          alt={produto.nome}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          unoptimized
        />
        <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-sm">
          {produto.categoria}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 min-h-10">
          {produto.nome}
        </h3>
        <p className="text-lg font-bold text-blue-600">
          R${" "}
          {produto.preco.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <button
          type="button"
          className="mt-auto flex items-center justify-center gap-2 bg-blue-500 text-white rounded-md py-2 text-sm font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <ShoppingCart size={18} />
          Adicionar
        </button>
      </div>
    </div>
  );
}