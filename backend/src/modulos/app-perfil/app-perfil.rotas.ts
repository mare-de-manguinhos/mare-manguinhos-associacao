import type { FastifyInstance } from "fastify";
import { autenticarConsumidor } from "../../middlewares/autenticar-consumidor.js";
import { appPerfilServico } from "./app-perfil.servico.js";
import { esquemaAtualizarPerfil, esquemaCriarEndereco } from "./app-perfil.esquemas.js";

export async function rotasAppPerfil(app: FastifyInstance) {
  app.addHook("preHandler", autenticarConsumidor);

  app.get("/", async (requisicao) => {
    return appPerfilServico.buscar(requisicao.user.sub);
  });

  app.put("/", async (requisicao) => {
    const dados = esquemaAtualizarPerfil.parse(requisicao.body);
    return appPerfilServico.atualizar(requisicao.user.sub, dados);
  });

  app.get("/enderecos", async (requisicao) => {
    return appPerfilServico.listarEnderecos(requisicao.user.sub);
  });

  app.post("/enderecos", async (requisicao, resposta) => {
    const dados = esquemaCriarEndereco.parse(requisicao.body);
    const endereco = await appPerfilServico.criarEndereco(requisicao.user.sub, dados);
    return resposta.status(201).send(endereco);
  });

  app.delete<{ Params: { id: string } }>("/enderecos/:id", async (requisicao, resposta) => {
    await appPerfilServico.removerEndereco(requisicao.params.id, requisicao.user.sub);
    return resposta.status(204).send();
  });
}
