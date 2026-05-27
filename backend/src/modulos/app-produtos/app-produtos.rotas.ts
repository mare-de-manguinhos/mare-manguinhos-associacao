import type { FastifyInstance } from "fastify";
import { appProdutosServico } from "./app-produtos.servico.js";
import { esquemaListarProdutos } from "./app-produtos.esquemas.js";

export async function rotasAppProdutos(app: FastifyInstance) {
  app.get("/", async (requisicao) => {
    const filtros = esquemaListarProdutos.parse(requisicao.query);
    return appProdutosServico.listar(filtros);
  });

  app.get<{ Params: { id: string } }>("/:id", async (requisicao) => {
    return appProdutosServico.buscarPorId(requisicao.params.id);
  });
}
