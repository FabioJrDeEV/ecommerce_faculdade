"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Usuario = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  status: string;
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<Usuario>;
  registrar: (dados: {
    nome: string;
    email: string;
    senha: string;
  }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

function parseUser(data: any): Usuario {
  return {
    id: data.id ?? "",
    nome: data.nome ?? "",
    email: data.email ?? "",
  };
}

function isAuthenticated(token: string | null): boolean {
  return token !== null && token.length > 0;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState("unauthenticated");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("token");
  });

  useEffect(() => {
    if (!isAuthenticated(token)) {
      setStatus("unauthenticated");
      setUsuario(null);
      return;
    }
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Não autenticado");
        return res.json();
      })
      .then((data) => {
        setUsuario(parseUser(data));
        setStatus("authenticated");
      })
      .catch(() => {
        window.localStorage.removeItem("token");
        setToken(null);
        setStatus("unauthenticated");
      });
  }, []);

  function login(email: string, senha: string) {
    return new Promise<Usuario>((resolve, reject) => {
      fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      })
        .then((res) => {
          if (!res.ok) {
            return res
              .json()
              .then((erro) =>
                reject(new Error(erro?.message ?? "Credenciais inválidas")),
              );
          }
          return res.json();
        })
        .then((dados) => {
          window.localStorage.setItem("token", dados.access_token);
          setToken(dados.access_token);
          const usuario = parseUser(dados.usuario);
          setUsuario(usuario);
          setStatus("authenticated");
          resolve(usuario);
        })
        .catch(reject);
    });
  }

  function registrar(dados: { nome: string; email: string; senha: string }) {
    return new Promise<void>((resolve, reject) => {
      fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })
        .then((res) => {
          if (!res.ok) {
            return res
              .json()
              .then((erro) =>
                reject(new Error(erro?.message ?? "Erro ao registrar")),
              );
          }
          window.localStorage.removeItem("token");
          setToken(null);
          setStatus("unauthenticated");
          resolve();
        })
        .catch(reject);
    });
  }

  function logout() {
    window.localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
    setStatus("unauthenticated");
  }

  const value = useMemo(
    () => ({
      status,
      usuario,
      token,
      login,
      registrar,
      logout,
    }),
    [status, usuario, token],
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
