import { prisma } from "../../infraestrutura/prisma/cliente.js";
import { ErroAplicacao, ErroNaoEncontrado } from "../../compartilhado/erros.js";
import type { EntradaAtualizarPerfil, EntradaCriarEndereco } from "./app-perfil.esquemas.js";

export const appPerfilServico = {
  async buscar(consumidorId: string) {
    const consumidor = await prisma.consumidor.findUnique({ where: { id: consumidorId } });
    if (!consumidor) throw new ErroNaoEncontrado("Consumidor");
    return { id: consumidor.id, nome: consumidor.nome, email: consumidor.email, telefone: consumidor.telefone };
  },

  async atualizar(consumidorId: string, dados: EntradaAtualizarPerfil) {
    const consumidor = await prisma.consumidor.update({
      where: { id: consumidorId },
      data: dados,
    });
    return { id: consumidor.id, nome: consumidor.nome, email: consumidor.email, telefone: consumidor.telefone };
  },

  async listarEnderecos(consumidorId: string) {
    return prisma.enderecoConsumidor.findMany({
      where: { consumidorId },
      orderBy: [{ principal: "desc" }, { id: "asc" }],
    });
  },

  async criarEndereco(consumidorId: string, dados: EntradaCriarEndereco) {
    if (dados.principal) {
      await prisma.enderecoConsumidor.updateMany({
        where: { consumidorId },
        data: { principal: false },
      });
    }
    return prisma.enderecoConsumidor.create({ data: { ...dados, consumidorId } });
  },

  async removerEndereco(id: string, consumidorId: string) {
    const endereco = await prisma.enderecoConsumidor.findUnique({ where: { id } });
    if (!endereco) throw new ErroNaoEncontrado("Endereço");
    if (endereco.consumidorId !== consumidorId) throw new ErroAplicacao("Endereço não pertence ao consumidor", 403);
    await prisma.enderecoConsumidor.delete({ where: { id } });
  },
};
