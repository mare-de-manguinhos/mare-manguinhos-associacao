import type { FastifyInstance } from "fastify";
import { autenticarConsumidor } from "../../middlewares/autenticar-consumidor.js";
import { appPedidosServico } from "./app-pedidos.servico.js";
import { esquemaCriarPedido, esquemaListarPedidos } from "./app-pedidos.esquemas.js";

export async function rotasAppPedidos(app: FastifyInstance) {
  app.addHook("preHandler", autenticarConsumidor);

  app.post("/", async (requisicao, resposta) => {
    const dados = esquemaCriarPedido.parse(requisicao.body);
    const pedido = await appPedidosServico.criar(requisicao.user.sub, dados);
    return resposta.status(201).send(pedido);
  });

  app.get("/meus", async (requisicao) => {
    const { pagina, limite } = esquemaListarPedidos.parse(requisicao.query);
    return appPedidosServico.listarMeus(requisicao.user.sub, pagina, limite);
  });

  app.get<{ Params: { id: string } }>("/:id", async (requisicao) => {
    return appPedidosServico.buscarPorId(requisicao.params.id, requisicao.user.sub);
  });
}
