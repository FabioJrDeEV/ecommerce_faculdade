"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type CarrinhoItem = {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
};

type CarrinhoContextType = {
  itens: CarrinhoItem[];
  totalItens: number;
  totalPreco: number;
  adicionar: (item: Omit<CarrinhoItem, "quantidade">) => void;
  remover: (id: string) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  limpar: () => void;
};

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(
  undefined,
);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<CarrinhoItem[]>([]);

  const adicionar = useCallback(
    (item: Omit<CarrinhoItem, "quantidade">) => {
      setItens((prev) => {
        const existente = prev.find((i) => i.id === item.id);
        if (existente) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i,
          );
        }
        return [...prev, { ...item, quantidade: 1 }];
      });
    },
    [],
  );

  const remover = useCallback((id: string) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const atualizarQuantidade = useCallback(
    (id: string, quantidade: number) => {
      setItens((prev) =>
        quantidade <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, quantidade } : i)),
      );
    },
    [],
  );

  const limpar = useCallback(() => setItens([]), []);

  const totalItens = useMemo(
    () => itens.reduce((acc, i) => acc + i.quantidade, 0),
    [itens],
  );

  const totalPreco = useMemo(
    () => itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0),
    [itens],
  );

  const value = useMemo(
    () => ({
      itens,
      totalItens,
      totalPreco,
      adicionar,
      remover,
      atualizarQuantidade,
      limpar,
    }),
    [itens, totalItens, totalPreco, adicionar, remover, atualizarQuantidade, limpar],
  );

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  }
  return context;
}