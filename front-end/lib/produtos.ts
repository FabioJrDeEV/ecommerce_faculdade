export type Produto = {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  imagem: string;
  descricao: string;
};

export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export const categorias: string[] = [
  "Todos",
  "Maquinas",
  "Navalhas",
  "Pentes",
  "Tesouras",
  "Produtos",
];

export const produtos: Produto[] = [
  {
    id: "1",
    nome: "Máquina de Corte Sem Fio Profissional",
    preco: 249.9,
    categoria: "Maquinas",
    imagem: "/logoBarbearia.jpg",
    descricao: "Máquina de corte sem fio com bateria de longa duração e lâminas de precisão.",
  },
  {
    id: "2",
    nome: "Máquina Clássica Carbon",
    preco: 179.9,
    categoria: "Maquinas",
    imagem: "/logoBarbearia.jpg",
    descricao: "Máquina clássica com motor de alta rotação e lâmina de carbono afiada.",
  },
  {
    id: "3",
    nome: "Navalha Clássica Solingen",
    preco: 89.9,
    categoria: "Navalhas",
    imagem: "/logoBarbearia.jpg",
    descricao: "Navalha artesanal de aço inox com cabo de madeira, ideal para acabamento.",
  },
  {
    id: "4",
    nome: "Navalha de Segurança com Lâminas",
    preco: 49.9,
    categoria: "Navalhas",
    imagem: "/logoBarbearia.jpg",
    descricao: "Kit com navalha de segurança e lâminas descartáveis de reposição.",
  },
  {
    id: "5",
    nome: "Pente de Madeira Premium",
    preco: 29.9,
    categoria: "Pentes",
    imagem: "/logoBarbearia.jpg",
    descricao: "Pente de madeira maciça com acabamento artesanal, não quebra o cabelo.",
  },
  {
    id: "6",
    nome: "Pente Fino de Separação",
    preco: 19.9,
    categoria: "Pentes",
    imagem: "/logoBarbearia.jpg",
    descricao: "Pente fino para desenhos e linhas precisas em cortes modernos.",
  },
  {
    id: "7",
    nome: "Tesoura Texturizadora Premium",
    preco: 149.9,
    categoria: "Tesouras",
    imagem: "/logoBarbearia.jpg",
    descricao: "Tesoura texturizadora de aço japonês para volume e acabamentos.",
  },
  {
    id: "8",
    nome: "Tesoura Reta Profissional",
    preco: 129.9,
    categoria: "Tesouras",
    imagem: "/logoBarbearia.jpg",
    descricao: "Tesoura reta cromada com afiação precisa e parafuso regulável.",
  },
  {
    id: "9",
    nome: "Óleo Capilar Matte",
    preco: 34.9,
    categoria: "Produtos",
    imagem: "/logoBarbearia.jpg",
    descricao: "Óleo capilar com efeito matte, controle de frizz e brilho natural.",
  },
  {
    id: "10",
    nome: "Pomada Modeladora Fixação Forte",
    preco: 39.9,
    categoria: "Produtos",
    imagem: "/logoBarbearia.jpg",
    descricao: "Pomada para modelagem com fixação forte e acabamento seco.",
  },
  {
    id: "11",
    nome: "Kit Barboterapia Completo",
    preco: 79.9,
    categoria: "Produtos",
    imagem: "/logoBarbearia.jpg",
    descricao: "Kit com pré-shave, espuma e pós-barba para cuidados da pele.",
  },
  {
    id: "12",
    nome: "Máquina Recarregável 5 Em 1",
    preco: 299.9,
    categoria: "Maquinas",
    imagem: "/logoBarbearia.jpg",
    descricao: "Multifuncional com 5 cabeçotes, recarregável via USB-C.",
  },
];