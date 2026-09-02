"use client";

import { useState } from "react";

type AvaliacaoFormProps = {
  onSubmit: (dados: { nota: number; comentario: string }) => Promise<void> | void;
  enviando?: boolean;
};

const Rótulos: Record<number, string> = {
  1: "Muito insatisfeito",
  2: "Insatisfeito",
  3: "Neutro",
  4: "Satisfeito",
  5: "Muito satisfeito",
};

export default function AvaliacaoForm({
  onSubmit,
  enviando,
}: AvaliacaoFormProps) {
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (nota < 1 || nota > 5) {
      setErro("Selecione uma nota de 1 a 5 estrelas");
      return;
    }
    setErro(null);
    try {
      await onSubmit({ nota, comentario: comentario.trim() });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar avaliação");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Como você avalia sua experiência?
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((estrela) => {
            const ativa = (hover || nota) >= estrela;
            return (
              <button
                key={estrela}
                type="button"
                aria-label={`Dar nota ${estrela}`}
                onClick={() => setNota(estrela)}
                onMouseEnter={() => setHover(estrela)}
                onMouseLeave={() => setHover(0)}
                className="p-1 cursor-pointer transition-transform hover:scale-110"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill={ativa ? "#FACC15" : "none"}
                  stroke={ativa ? "#F59E0B" : "#9CA3AF"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            );
          })}
        </div>
        <span className="text-xs text-gray-500 h-4">
          {(hover || nota) > 0 ? Rótulos[hover || nota] : "Selecione de 1 a 5"}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="comentario"
          className="text-sm font-medium text-gray-700"
        >
          Comentário (opcional)
        </label>
        <textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Conte como foi sua experiência..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
        />
        <span className="text-xs text-gray-400 self-end">
          {comentario.length}/500
        </span>
      </div>

      {erro && (
        <p className="text-sm text-red-500 text-center" role="alert">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando || nota === 0}
        className="bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {enviando ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
