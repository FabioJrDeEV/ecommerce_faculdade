"use client";

import Image from "next/image";

export default function Banner() {
  const scrollParaCatalogo = () => {
    const catalogo = document.getElementById("catalogo");
    catalogo?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-blue-400">
      <div className="w-full mx-auto max-w-7xl px-4 py-10 sm:py-14 md:py-16 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block bg-white/20 text-white text-xs sm:text-sm px-3 py-1 rounded-full mb-4">
            Novidades da estação
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Equipamentos de precisão para sua barbearia
          </h2>
          <p className="text-white/90 text-sm sm:text-base mb-6 max-w-lg mx-auto md:mx-0">
            Máquinas, navalhas, tesouras e produtos de alta qualidade para
            elevar o padrão do seu trabalho.
          </p>
          <button
            type="button"
            onClick={scrollParaCatalogo}
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Ver catálogo
          </button>
        </div>
        <div className="hidden md:block w-64 lg:w-80 shrink-0">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white/10">
            <Image
              src="/logoBarbearia.jpg"
              alt="Loja do Barbeiro"
              width={320}
              height={320}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}