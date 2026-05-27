import bcrypt from "bcryptjs";
import { prisma } from "../../infraestrutura/prisma/cliente.js";
import { ErroAplicacao, ErroConflito, ErroNaoAutorizado } from "../../compartilhado/erros.js";
import type { EntradaCadastro, EntradaLogin } from "./app-auth.esquemas.js";

export const appAuthServico = {
  async cadastrar(dados: EntradaCadastro) {
    const existente = await prisma.consumidor.findUnique({ where: { email: dados.email } });
    if (existente) throw new ErroConflito("E-mail já cadastrado");

    const senhaHash = await bcrypt.hash(dados.senha, 10);
    const consumidor = await prisma.consumidor.create({
      data: { nome: dados.nome, email: dados.email, telefone: dados.telefone, senhaHash },
    });

    return { id: consumidor.id, nome: consumidor.nome, email: consumidor.email };
  },

  async login(dados: EntradaLogin) {
    const consumidor = await prisma.consumidor.findUnique({ where: { email: dados.email } });
    if (!consumidor) throw new ErroNaoAutorizado("E-mail ou senha inválidos");

    const senhaCorreta = await bcrypt.compare(dados.senha, consumidor.senhaHash);
    if (!senhaCorreta) throw new ErroNaoAutorizado("E-mail ou senha inválidos");

    return { id: consumidor.id, nome: consumidor.nome, email: consumidor.email };
  },

  async buscarPorId(id: string) {
    const consumidor = await prisma.consumidor.findUnique({ where: { id } });
    if (!consumidor) throw new ErroAplicacao("Consumidor não encontrado", 404);
    return {
      id: consumidor.id,
      nome: consumidor.nome,
      email: consumidor.email,
      telefone: consumidor.telefone,
      criadoEm: consumidor.criadoEm,
    };
  },
};
