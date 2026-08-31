"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterData } from "@/lib/validacoes";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { registrar } = useAuth();
  const [enviando, setEnviando] = useState(false);
  const [registrado, setRegistrado] = useState(false);
  const [erro, setErro] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (dados: RegisterData) => {
    setEnviando(true);
    setErro("");
    try {
      await registrar({
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
      });
      setRegistrado(true);
      setTimeout(() => {
        router.push("/login");
      }, 4000);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao registrar");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-8">
        {registrado ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">
              ✓
            </span>
            <h1 className="text-xl font-bold text-gray-800">
              Registro confirmado!
            </h1>
            <p className="text-sm text-gray-500">
              Sua conta foi criada com sucesso. Você será redirecionado para a
              página de login...
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Criar conta
            </h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Preencha seus dados para se registrar
            </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="nome" className="text-sm font-medium text-gray-700">
              Nome
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
          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmarSenha"
              className="text-sm font-medium text-gray-700"
            >
              Confirmar senha
            </label>
            <input
              id="confirmarSenha"
              type="password"
              placeholder="••••••••"
              {...register("confirmarSenha")}
              className={`border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                errors.confirmarSenha ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmarSenha && (
              <p className="text-xs text-red-500">
                {errors.confirmarSenha.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {enviando ? "Registrando..." : "Registrar"}
          </button>
          {erro && (
            <p className="text-xs text-red-500 text-center">{erro}</p>
          )}
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Entrar
          </Link>
        </p>
          </>
        )}
      </div>
    </main>
  );
}