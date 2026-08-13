"use client";

import { Search } from "@deemlol/next-icons";
import Link from "next/link";

type BuscarInputProps = {
  busca: string;
  onBusca: (valor: string) => void;
  sugestoes: { nome: string; id: string }[];
};

export default function BuscarInput({
  busca,
  onBusca,
  sugestoes,
}: BuscarInputProps) {
  const aberto = busca.trim().length > 0 && sugestoes.length > 0;

  return (
    <div className="relative">
      <div className="w-full flex items-center bg-blue-50 p-2 rounded-lg">
        <Search size={20} className="shrink-0" style={{ color: "#008ECC" }} />
        <input
          type="text"
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          className="flex-1 min-w-0 pl-2 outline-none text-gray-600 bg-transparent"
          placeholder="Pesquisar..."
        />
      </div>
      {aberto && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 overflow-hidden">
          {sugestoes.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.id}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
              >
                {p.nome}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}