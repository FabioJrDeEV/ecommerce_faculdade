"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AvaliacaoForm from "../_components/avaliacao/AvaliacaoForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

type Avaliacao = {
  id: string;
  nota: number;
  comentario: string | null;
  criadoEm: string;
  usuario?: { id: string; nome: string };
};

export default function AvaliarPage() {
  const { usuario, token, status } = useAuth();
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [carregado, setCarregado] = useState(false);
  const [jaAvaliou, setJaAvaliou] = useState<Avaliacao[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?redirect=/avaliar");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    fetch(`${API_URL}/avaliacoes/minhas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((dados: Avaliacao[]) => setJaAvaliou(Array.isArray(dados) ? dados : []))
      .catch(() => setJaAvaliou([]))
      .finally(() => setCarregado(true));
  }, [status, token]);

  async function enviar({ nota, comentario }: { nota: number; comentario: string }) {
    if (!token) throw new Error("Você precisa estar logado");
    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/avaliacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nota,
          comentario: comentario.length > 0 ? comentario : undefined,
        }),
      });
      if (!res.ok) {
        const erro = await res.json().catch(() => null);
        throw new Error(erro?.message ?? "Falha ao enviar avaliação");
      }
      const nova: Avaliacao = await res.json();
      setJaAvaliou((prev) => [nova, ...prev]);
    } finally {
      setEnviando(false);
    }
  }

  if (status === "unauthenticated" || status === "carregando") {
    return (
      <main className="w-full mx-auto max-w-7xl px-4 py-8 flex-1 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="w-full mx-auto max-w-3xl px-4 py-8 flex-1">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Avalie sua experiência
        </h1>
        <p className="text-gray-500 mt-2">
          Olá{usuario ? `, ${usuario.nome.split(" ")[0]}` : ""}! Sua opinião é
          muito importante para nós. Conta pra gente como foi sua compra.
        </p>
      </div>

      <section className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <AvaliacaoForm onSubmit={enviar} enviando={enviando} />
      </section>

      {carregado && jaAvaliou.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Suas avaliações anteriores
          </h2>
          <div className="flex flex-col gap-3">
            {jaAvaliou.map((av) => (
              <article
                key={av.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((e) => (
                    <svg
                      key={e}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={e <= av.nota ? "#FACC15" : "none"}
                      stroke={e <= av.nota ? "#F59E0B" : "#9CA3AF"}
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(av.criadoEm).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {av.comentario && (
                  <p className="text-sm text-gray-600">{av.comentario}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-blue-500 hover:text-blue-700 font-semibold"
        >
          Voltar para a loja
        </Link>
      </div>
    </main>
  );
}
