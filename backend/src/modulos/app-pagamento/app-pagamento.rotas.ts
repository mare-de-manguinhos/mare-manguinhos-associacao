import type { FastifyInstance } from "fastify";
import { autenticarConsumidor } from "../../middlewares/autenticar-consumidor.js";
import { esquemaGerarPix, esquemaProcessarCartao } from "./app-pagamento.esquemas.js";

export async function rotasAppPagamento(app: FastifyInstance) {
  app.addHook("preHandler", autenticarConsumidor);

  app.post("/pix", async (requisicao) => {
    const { pedidoId, valor } = esquemaGerarPix.parse(requisicao.body);
    const expiraEm = new Date(Date.now() + 30 * 60 * 1000);
    return {
      qrCode: `00020126580014br.gov.bcb.pix0136${pedidoId}5204000053039865802BR5925Mare de Manguinhos6009Manguinhos62290525${pedidoId.substring(0, 25)}6304ABCD`,
      codigo: `pix-${pedidoId.substring(0, 8)}-${Math.floor(valor * 100)}`,
      expiraEm: expiraEm.toISOString(),
    };
  });

  app.post("/cartao", async (requisicao) => {
    const { pedidoId } = esquemaProcessarCartao.parse(requisicao.body);
    return {
      status: "aprovado",
      transacaoId: `txn_${pedidoId.substring(0, 8)}_${Date.now()}`,
    };
  });
}
