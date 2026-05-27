import { prisma } from "../../infraestrutura/prisma/cliente.js";
import { ErroNaoEncontrado } from "../../compartilhado/erros.js";
import type { EntradaListarProdutos } from "./app-produtos.esquemas.js";

function mapearProduto(p: {
  id: string; especie: string | null; nome: string; descricao: string | null;
  precoPorKg: number | null; preco: number; pesoDisponivelKg: number | null;
  cortesDisponiveis: string; categoria: string; atualizadoEm: Date;
  loja: { associado: { id: string; nome: string } };
}, incluirCortes = false) {
  const agora = new Date();
  const vintQuatroHAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
  const badges: string[] = [];
  if (p.atualizadoEm > vintQuatroHAtras) badges.push("Hoje");
  if ((p.pesoDisponivelKg ?? 0) < 3) badges.push("Últimas unidades");
  if ((p.precoPorKg ?? p.preco) >= 50) badges.push("Premium");

  const base = {
    id: p.id,
    especie: p.especie ?? p.nome,
    foto: "",
    precoPorKg: p.precoPorKg ?? p.preco,
    pesoDisponivel: p.pesoDisponivelKg ?? 0,
    categoria: p.categoria,
    badges,
    pescador: { id: p.loja.associado.id, nome: p.loja.associado.nome },
  };

  if (incluirCortes) {
    let cortes: string[];
    try { cortes = JSON.parse(p.cortesDisponiveis); } catch { cortes = ["inteiro"]; }
    return { ...base, cortesDisponiveis: cortes, descricao: p.descricao };
  }

  return base;
}

export const appProdutosServico = {
  async listar(filtros: EntradaListarProdutos) {
    const produtos = await prisma.produto.findMany({
      where: {
        ativo: true,
        ...(filtros.categoria && filtros.categoria !== "todos" ? { categoria: filtros.categoria === "crustaceos" ? "crustaceo" : "peixe" } : {}),
        ...(filtros.busca ? {
          OR: [
            { nome: { contains: filtros.busca } },
            { especie: { contains: filtros.busca } },
          ],
        } : {}),
        ...(filtros.pescador_id ? { loja: { associadoId: filtros.pescador_id } } : {}),
      },
      include: {
        loja: { include: { associado: { select: { id: true, nome: true } } } },
      },
      orderBy: { atualizadoEm: "desc" },
    });

    return produtos.map((p) => mapearProduto(p, false));
  },

  async buscarPorId(id: string) {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        loja: { include: { associado: { select: { id: true, nome: true } } } },
      },
    });
    if (!produto || !produto.ativo) throw new ErroNaoEncontrado("Produto");
    return mapearProduto(produto, true);
  },
};
