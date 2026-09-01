"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useAuth } from "./auth";

export type CarrinhoItem = {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
const GUEST_STORAGE_KEY = "carrinho:guest";

function carregarItensGuest(): CarrinhoItem[] {
  if (typeof window === "undefined") return [];
  try {
    const salvo = window.localStorage.getItem(GUEST_STORAGE_KEY);
    return salvo ? (JSON.parse(salvo) as CarrinhoItem[]) : [];
  } catch {
    return [];
  }
}

type CarrinhoContextType = {
  itens: CarrinhoItem[];
  totalItens: number;
  totalPreco: number;
  carregando: boolean;
  salvar: boolean;
  adicionar: (item: Omit<CarrinhoItem, "quantidade">) => void;
  remover: (id: string) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  limpar: () => void;
};

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(
  undefined,
);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const { status, usuario, token } = useAuth();

  const [itens, setItens] = useState<CarrinhoItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvar, setSalvar] = useState(false);

  const usuarioIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && usuario && token) {
      if (usuarioIdRef.current === usuario.id) return;

      usuarioIdRef.current = usuario.id;
      setCarregando(true);
      fetch(`${API_URL}/carrinho`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Falha ao carregar carrinho");
          return res.json();
        })
        .then((dados: { itens?: CarrinhoItem[] }) => {
          setItens(Array.isArray(dados.itens) ? dados.itens : []);
        })
        .catch(() => {
          setItens([]);
        })
        .finally(() => setCarregando(false));
    } else {
      if (usuarioIdRef.current !== null) {
        usuarioIdRef.current = null;
        setItens(carregarItensGuest());
      } else if (itens.length === 0 && !carregando) {
        setItens(carregarItensGuest());
      }
      setCarregando(false);
    }
  }, [status, usuario, token]);

  useEffect(() => {
    if (status !== "authenticated") {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(itens));
      } catch {
        // ignore
      }
    }
  }, [itens, status]);

  useEffect(() => {
    if (status !== "authenticated" || !token || !usuario) return;
    if (carregando) return;

    setSalvar(true);
    const handle = window.setTimeout(() => {
      fetch(`${API_URL}/carrinho`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itens }),
      })
        .catch(() => {
          // ignore
        })
        .finally(() => setSalvar(false));
    }, 400);

    return () => {
      window.clearTimeout(handle);
      setSalvar(false);
    };
  }, [itens, status, token, usuario, carregando]);

  const adicionar = useCallback((item: Omit<CarrinhoItem, "quantidade">) => {
    setItens((prev) => {
      const existente = prev.find((i) => i.id === item.id);
      if (existente) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i,
        );
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  }, []);

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
      carregando,
      salvar,
      adicionar,
      remover,
      atualizarQuantidade,
      limpar,
    }),
    [
      itens,
      totalItens,
      totalPreco,
      carregando,
      salvar,
      adicionar,
      remover,
      atualizarQuantidade,
      limpar,
    ],
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
