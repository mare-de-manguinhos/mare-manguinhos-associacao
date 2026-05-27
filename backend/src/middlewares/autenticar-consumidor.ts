import type { FastifyReply, FastifyRequest } from "fastify";
import { ErroNaoAutorizado } from "../compartilhado/erros.js";

export async function autenticarConsumidor(requisicao: FastifyRequest, _resposta: FastifyReply) {
  try {
    await requisicao.jwtVerify();
    if (requisicao.user.papel !== "CONSUMIDOR") {
      throw new ErroNaoAutorizado("Acesso restrito ao app do consumidor");
    }
  } catch (erro) {
    if (erro instanceof ErroNaoAutorizado) throw erro;
    throw new ErroNaoAutorizado("Token ausente ou inválido");
  }
}
