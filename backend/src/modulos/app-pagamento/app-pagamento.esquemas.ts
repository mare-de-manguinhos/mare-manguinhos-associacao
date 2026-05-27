import { z } from "zod";

export const esquemaGerarPix = z.object({
  pedidoId: z.string().uuid(),
  valor: z.number().positive(),
});

export const esquemaProcessarCartao = z.object({
  pedidoId: z.string().uuid(),
  valor: z.number().positive(),
  tokenCartao: z.string().min(1),
});
