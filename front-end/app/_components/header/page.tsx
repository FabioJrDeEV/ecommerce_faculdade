import { Search, User, ShoppingCart } from "@deemlol/next-icons";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border border-gray-300">
      <div className="mx-20 flex justify-between items-center p-8">
        <div className="flex items-center space-x-4">
          <h1 className="font-bold text-lg" style={{ color: "#008ECC" }}>
            Loja do Barbeiro
          </h1>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-full flex items-center bg-blue-50 p-2 rounded-lg">
            <div className="w-sm flex align-center gap-5">
              <Search size={20} style={{ color: "#008ECC" }} />
              <input
                type="text"
                className="outline-none text-gray-600"
                placeholder="Pesquisar..."
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User size={24} style={{ color: "#008ECC" }} />
            <Link href="/login" className="text-gray-600 text-sm font-semibold">
              Entrar/Registrar
            </Link>
          </div>
          <span className="h-[22px] border border-gray-300"></span>
          <div className="flex items-center gap-2">
            <ShoppingCart size={24} style={{ color: "#008ECC" }} />
            <h1 className="text-gray-600 text-sm font-semibold">Cart</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
