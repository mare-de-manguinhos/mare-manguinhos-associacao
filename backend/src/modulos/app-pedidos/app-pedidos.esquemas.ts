import { z } from "zod";

export const esquemaCriarPedido = z.object({
  itens: z.array(z.object({
    produtoId: z.string().uuid(),
    corte: z.enum(["inteiro", "limpo", "file"]),
    pesoKg: z.number().positive(),
  })).min(1),
  enderecoEntrega: z.string().min(5),
  janelaEntrega: z.string().min(5),
  formaPagamento: z.enum(["pix", "cartao"]),
  frete: z.number().min(0),
  valorTotal: z.number().positive(),
});

export const esquemaListarPedidos = z.object({
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(50).default(20),
});

export type EntradaCriarPedido = z.infer<typeof esquemaCriarPedido>;
