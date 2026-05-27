import { z } from "zod";

export const esquemaCalcularFrete = z.object({
  endereco: z.string().min(5),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
