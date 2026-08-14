import { Scissors, Shield, Truck, Star } from "@deemlol/next-icons";

const diferenciais = [
  {
    icon: Scissors,
    titulo: "Equipamentos de qualidade",
    texto: "Produtos selecionados a dedo para o dia a dia do barbeiro.",
  },
  {
    icon: Shield,
    titulo: "Compra segura",
    texto: "Pagamento protegido e garantia de satisfação.",
  },
  {
    icon: Truck,
    titulo: "Entrega rápida",
    texto: "Envio ágil para todo o Brasil.",
  },
  {
    icon: Star,
    titulo: "Atendimento especializado",
    texto: "Time pronto para ajudar na escolha certa.",
  },
];

export default function Sobre() {
  return (
    <section className="w-full mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Sobre a Loja do Barbeiro
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Somos uma loja especializada em equipamentos e produtos para
          barbearia. Nosso objetivo é oferecer itens de confiança para quem
          leva a profissão a sério.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {diferenciais.map((d) => (
          <div
            key={d.titulo}
            className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-lg p-6 text-center"
          >
            <d.icon size={28} style={{ color: "#008ECC" }} />
            <h3 className="font-semibold text-gray-800">{d.titulo}</h3>
            <p className="text-sm text-gray-500">{d.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}