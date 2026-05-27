import type { FastifyInstance } from "fastify";
import { autenticarConsumidor } from "../../middlewares/autenticar-consumidor.js";
import { appAuthServico } from "./app-auth.servico.js";
import { esquemaCadastro, esquemaLogin } from "./app-auth.esquemas.js";

export async function rotasAppAuth(app: FastifyInstance) {
  app.post("/cadastro", async (requisicao, resposta) => {
    const dados = esquemaCadastro.parse(requisicao.body);
    const consumidor = await appAuthServico.cadastrar(dados);
    const token = app.jwt.sign({ sub: consumidor.id, nome: consumidor.nome, email: consumidor.email, papel: "CONSUMIDOR" });
    return resposta.status(201).send({ ...consumidor, token });
  });

  app.post("/login", async (requisicao) => {
    const dados = esquemaLogin.parse(requisicao.body);
    const consumidor = await appAuthServico.login(dados);
    const token = app.jwt.sign({ sub: consumidor.id, nome: consumidor.nome, email: consumidor.email, papel: "CONSUMIDOR" });
    return { ...consumidor, token };
  });

  app.get("/eu", { preHandler: autenticarConsumidor }, async (requisicao) => {
    return appAuthServico.buscarPorId(requisicao.user.sub);
  });
}
