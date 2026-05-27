import { prisma } from "../../infraestrutura/prisma/cliente.js";
import { ErroAplicacao, ErroNaoEncontrado } from "../../compartilhado/erros.js";
import type { EntradaCriarPedido } from "./app-pedidos.esquemas.js";

function mapearItemResumo(item: {
  produto: { especie: string | null; nome: string };
  corte: string;
  pesoKg: number;
}) {
  return `${item.produto.especie ?? item.produto.nome} (${item.corte}, ${item.pesoKg}kg)`;
}

export const appPedidosServico = {
  async criar(consumidorId: string, dados: EntradaCriarPedido) {
    const produtos = await Promise.all(
      dados.itens.map(async (item) => {
        const produto = await prisma.produto.findUnique({ where: { id: item.produtoId } });
        if (!produto || !produto.ativo) throw new ErroAplicacao(`Produto ${item.produtoId} não disponível`, 400);
        return { ...item, precoUnitario: produto.precoPorKg ?? produto.preco };
      })
    );

    const pedido = await prisma.pedidoApp.create({
      data: {
        consumidorId,
        enderecoEntrega: dados.enderecoEntrega,
        janelaEntrega: dados.janelaEntrega,
        formaPagamento: dados.formaPagamento,
        frete: dados.frete,
        valorTotal: dados.valorTotal,
        itens: {
          create: produtos.map((p) => ({
            produtoId: p.produtoId,
            corte: p.corte,
            pesoKg: p.pesoKg,
            precoUnitario: p.precoUnitario,
          })),
        },
      },
      include: { itens: { include: { produto: true } } },
    });

    const resposta: Record<string, unknown> = {
      id: pedido.id,
      status: pedido.status,
      valorTotal: pedido.valorTotal,
      formaPagamento: pedido.formaPagamento,
      criadoEm: pedido.criadoEm,
    };

    if (dados.formaPagamento === "pix") {
      resposta.pix = {
        qrCode: `00020126580014br.gov.bcb.pix0136${pedido.id}5204000053039865802BR5925Mare de Manguinhos6009Manguinhos62290525${pedido.id.substring(0, 25)}6304ABCD`,
        codigo: `pix-${pedido.id.substring(0, 8)}`,
      };
    }

    return resposta;
  },

  async buscarPorId(id: string, consumidorId: string) {
    const pedido = await prisma.pedidoApp.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            produto: { select: { especie: true, nome: true } },
          },
        },
      },
    });
    if (!pedido) throw new ErroNaoEncontrado("Pedido");
    if (pedido.consumidorId !== consumidorId) throw new ErroAplicacao("Pedido não pertence ao consumidor", 403);

    return {
      id: pedido.id,
      status: pedido.status,
      itens: pedido.itens.map((item) => ({
        produto: { especie: item.produto.especie ?? item.produto.nome, foto: "" },
        corte: item.corte,
        pesoKg: item.pesoKg,
      })),
      enderecoEntrega: pedido.enderecoEntrega,
      janelaEntrega: pedido.janelaEntrega,
      frete: pedido.frete,
      valorTotal: pedido.valorTotal,
      formaPagamento: pedido.formaPagamento,
      criadoEm: pedido.criadoEm,
      atualizadoEm: pedido.atualizadoEm,
    };
  },

  async listarMeus(consumidorId: string, pagina: number, limite: number) {
    const [pedidos, total] = await Promise.all([
      prisma.pedidoApp.findMany({
        where: { consumidorId },
        include: { itens: { include: { produto: { select: { especie: true, nome: true } } }, take: 1 } },
        orderBy: { criadoEm: "desc" },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.pedidoApp.count({ where: { consumidorId } }),
    ]);

    return {
      pedidos: pedidos.map((p) => ({
        id: p.id,
        status: p.status,
        valorTotal: p.valorTotal,
        criadoEm: p.criadoEm,
        itensResumo: p.itens.length > 0 ? mapearItemResumo(p.itens[0]) : "",
      })),
      totalPaginas: Math.ceil(total / limite),
      paginaAtual: pagina,
    };
  },
};
