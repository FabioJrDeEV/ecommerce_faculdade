import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 mt-auto">
      <div className="w-full mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-lg" style={{ color: "#008ECC" }}>
            Loja do Barbeiro
          </h2>
          <p className="text-sm text-gray-400">
            O lugar mais completo para equipamentos e produtos da sua barbearia.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-white">Categorias</h3>
          <Link href="#catalogo" className="text-sm hover:text-blue-400">
            Máquinas
          </Link>
          <Link href="#catalogo" className="text-sm hover:text-blue-400">
            Navalhas
          </Link>
          <Link href="#catalogo" className="text-sm hover:text-blue-400">
            Pentes
          </Link>
          <Link href="#catalogo" className="text-sm hover:text-blue-400">
            Tesouras
          </Link>
          <Link href="#catalogo" className="text-sm hover:text-blue-400">
            Produtos
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-white">Institucional</h3>
          <Link href="/login" className="text-sm hover:text-blue-400">
            Entrar / Registar
          </Link>
          <Link href="/cart" className="text-sm hover:text-blue-400">
            Carrinho
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-white">Contato</h3>
          <p className="text-sm text-gray-400">contato@lojadobarbeiro.com</p>
          <p className="text-sm text-gray-400">(86) 9999-9999</p>
          <p className="text-sm text-gray-400">Seg a Sáb, 9h às 19h</p>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <p className="w-full mx-auto max-w-7xl px-4 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Loja do Barbeiro. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
