import type { FastifyInstance } from "fastify";
import { esquemaCalcularFrete } from "./app-frete.esquemas.js";

export async function rotasAppFrete(app: FastifyInstance) {
  app.post("/calcular", async (requisicao) => {
    const { endereco } = esquemaCalcularFrete.parse(requisicao.body);
    const enderecoNormalizado = endereco.toLowerCase();
    const valorFrete = enderecoNormalizado.includes("serra") && enderecoNormalizado.includes("es")
      ? 8.5
      : 12.0;
    return { valorFrete, prazoEstimadoMinutos: 45 };
  });
}
