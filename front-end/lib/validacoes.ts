import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe o e-mail")
    .email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nome: z.string().min(1, "Informe seu nome"),
    email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type RegisterData = z.infer<typeof registerSchema>;

export const checkoutSchema = z.object({
  nome: z.string().min(1, "Informe o nome completo"),
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  endereco: z.string().min(1, "Informe o endereço"),
  cidade: z.string().min(1, "Informe a cidade"),
  estado: z.string().min(2, "Informe o estado").max(2, "UF com 2 letras"),
  cep: z.string().min(1, "Informe o CEP"),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;