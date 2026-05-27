import { z } from "zod";

export const esquemaCadastro = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(10).max(15),
  senha: z.string().min(6),
});

export const esquemaLogin = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export type EntradaCadastro = z.infer<typeof esquemaCadastro>;
export type EntradaLogin = z.infer<typeof esquemaLogin>;
