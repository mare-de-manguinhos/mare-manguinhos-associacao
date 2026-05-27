import { z } from "zod";

export const esquemaListarProdutos = z.object({
  busca: z.string().optional(),
  categoria: z.string().optional(),
  pescador_id: z.string().uuid().optional(),
});

export type EntradaListarProdutos = z.infer<typeof esquemaListarProdutos>;
