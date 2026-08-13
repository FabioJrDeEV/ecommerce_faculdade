type ButtonCategoriasProps = {
  categoria: string;
  selecionada: string;
  onSelecionar: (categoria: string) => void;
};

export default function ButtonCategorias({
  categoria,
  selecionada,
  onSelecionar,
}: ButtonCategoriasProps) {
  return (
    <button
      key={categoria}
      className={`px-3 py-1.5 sm:px-5 sm:py-2 rounded-2xl cursor-pointer flex items-center gap-2 text-sm sm:text-base whitespace-nowrap transition-colors duration-200 ${
        selecionada === categoria
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
      onClick={() => onSelecionar(categoria)}
    >
      {categoria}
    </button>
  );
}
