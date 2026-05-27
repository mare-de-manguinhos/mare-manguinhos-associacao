import type { FastifyInstance } from "fastify";
import { prisma } from "../../infraestrutura/prisma/cliente.js";

const BANNER = {
  titulo: "Fresco hoje!",
  subtitulo: "Direto do pescador",
  descricao: "Capturado esta manhã em Manguinhos",
  imagem: "",
};

const CATEGORIAS = [
  { id: "todos", nome: "Todos" },
  { id: "peixes", nome: "Peixes" },
  { id: "crustaceos", nome: "Crustáceos" },
];

export async function rotasAppVitrine(app: FastifyInstance) {
  app.get("/", async () => {
    const pescadores = await prisma.associado.findMany({
      where: { status: "ativo" },
      select: {
        id: true,
        nome: true,
        lojas: {
          where: { status: "ativo" },
          select: { id: true },
          take: 1,
        },
      },
      take: 10,
    });

    const produtos = await prisma.produto.findMany({
      where: { ativo: true, pesoDisponivelKg: { gt: 0 } },
      include: {
        loja: {
          include: {
            associado: { select: { id: true, nome: true } },
          },
        },
      },
      take: 20,
    });

    const agora = new Date();
    const vintQuatroHAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

    const produtosMapeados = produtos.map((p) => {
      const badges: string[] = [];
      if (p.atualizadoEm > vintQuatroHAtras) badges.push("Hoje");
      if ((p.pesoDisponivelKg ?? 0) < 3) badges.push("Últimas unidades");
      if ((p.precoPorKg ?? 0) >= 50) badges.push("Premium");

      return {
        id: p.id,
        especie: p.especie ?? p.nome,
        foto: p.descricao?.startsWith("http") ? p.descricao : "",
        precoPorKg: p.precoPorKg ?? p.preco,
        pesoDisponivel: p.pesoDisponivelKg ?? 0,
        categoria: p.categoria,
        badges,
        pescador: {
          id: p.loja.associado.id,
          nome: p.loja.associado.nome,
        },
      };
    });

    const pescadoresMapeados = pescadores.map((a, idx) => {
      const cores = ["#2E7D32", "#8D6E63", "#1565C0", "#6A1550"];
      const partes = a.nome.split(" ");
      const iniciais = partes.length >= 2
        ? `${partes[0][0]}${partes[partes.length - 1][0]}`
        : a.nome.substring(0, 2);
      return {
        id: a.id,
        nome: a.nome,
        iniciais: iniciais.toUpperCase(),
        foto: "",
        avaliacao: 4.8,
        cor: cores[idx % cores.length],
      };
    });

    return {
      banner: BANNER,
      pescadores: pescadoresMapeados,
      categorias: CATEGORIAS,
      produtos: produtosMapeados,
    };
  });
}
