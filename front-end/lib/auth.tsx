"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

type Usuario = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<Usuario>;
  registrar: (dados: {
    nome: string;
    email: string;
    senha: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });
  const [carregando, setCarregando] = useState(() => token !== null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Não autenticado");
        return res.json() as Promise<Usuario>;
      })
      .then((dados) => {
        setUsuario(dados);
        setCarregando(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setCarregando(false);
      });
  }, [token]);

  const login = useCallback(async (email: string, senha: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    if (!res.ok) {
      const erro = await res.json().catch(() => null);
      throw new Error(erro?.message ?? "Credenciais inválidas");
    }
    const dados = await res.json();
    localStorage.setItem("token", dados.access_token);
    setToken(dados.access_token);
    setUsuario(dados.usuario);
    return dados.usuario as Usuario;
  }, []);

  const registrar = useCallback(
    async (dados: { nome: string; email: string; senha: string }) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!res.ok) {
        const erro = await res.json().catch(() => null);
        throw new Error(erro?.message ?? "Erro ao registrar");
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  }, []);

  const value = useMemo(
    () => ({ usuario, token, carregando, login, registrar, logout }),
    [usuario, token, carregando, login, registrar, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}