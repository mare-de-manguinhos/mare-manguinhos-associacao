import { z } from "zod";

export const esquemaAtualizarPerfil = z.object({
  nome: z.string().min(2).optional(),
  telefone: z.string().min(10).optional(),
});

export const esquemaCriarEndereco = z.object({
  label: z.string().min(1).default("Casa"),
  logradouro: z.string().min(2),
  numero: z.string().min(1),
  bairro: z.string().min(2),
  cidade: z.string().min(2),
  estado: z.string().length(2),
  cep: z.string().min(8),
  complemento: z.string().optional(),
  principal: z.boolean().default(false),
});

export type EntradaAtualizarPerfil = z.infer<typeof esquemaAtualizarPerfil>;
export type EntradaCriarEndereco = z.infer<typeof esquemaCriarEndereco>;
