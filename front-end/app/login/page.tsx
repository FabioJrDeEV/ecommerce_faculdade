"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@/lib/validacoes";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [erro, setErro] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (dados: LoginData) => {
    setErro("");
    try {
      await login(dados.email, dados.senha);
      router.push("/");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao entrar");
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Bem-vindo
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Entre para acessar sua conta
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
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
            <label
              htmlFor="senha"
              className="text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              {...register("senha")}
              className={`border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                errors.senha ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.senha && (
              <p className="text-xs text-red-500">{errors.senha.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Entrar
          </button>
          {erro && (
            <p className="text-xs text-red-500 text-center">{erro}</p>
          )}
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Não tem conta?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Registrar
          </Link>
        </p>
      </div>
    </main>
  );
}