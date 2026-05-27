import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { ambiente } from "./configuracao/ambiente.js";
import { tratadorDeErros } from "./compartilhado/tratador-erros.js";
import "./compartilhado/tipos.js";

import { rotasAutenticacao } from "./modulos/autenticacao/autenticacao.rotas.js";
import { rotasAssociados } from "./modulos/associados/associados.rotas.js";
import { rotasLojas } from "./modulos/lojas/lojas.rotas.js";
import { rotasPermissoes } from "./modulos/permissoes/permissoes.rotas.js";
import { rotasReunioes } from "./modulos/reunioes/reunioes.rotas.js";
import { rotasMensalidades } from "./modulos/mensalidades/mensalidades.rotas.js";
import { rotasDashboard } from "./modulos/dashboard/dashboard.rotas.js";
import { rotasApiPublica } from "./modulos/api-publica/api-publica.rotas.js";
import { rotasAuditoria } from "./modulos/auditoria/auditoria.rotas.js";
import { rotasProdutos } from "./modulos/produtos/produtos.rotas.js";
import { rotasVendas } from "./modulos/vendas/vendas.rotas.js";
import { rotasTransportes } from "./modulos/transportes/transportes.rotas.js";
import { rotasAppAuth } from "./modulos/app-auth/app-auth.rotas.js";
import { rotasAppVitrine } from "./modulos/app-vitrine/app-vitrine.rotas.js";
import { rotasAppProdutos } from "./modulos/app-produtos/app-produtos.rotas.js";
import { rotasAppPedidos } from "./modulos/app-pedidos/app-pedidos.rotas.js";
import { rotasAppFrete } from "./modulos/app-frete/app-frete.rotas.js";
import { rotasAppPagamento } from "./modulos/app-pagamento/app-pagamento.rotas.js";
import { rotasAppPerfil } from "./modulos/app-perfil/app-perfil.rotas.js";

export async function construirAplicacao() {
  const app = Fastify({
    logger: { level: "info" },
  });

  await app.register(cors, {
    origin: ambiente.ORIGEM_PERMITIDA.split(",").map((o) => o.trim()),
    credentials: true,
  });

  await app.register(jwt, {
    secret: ambiente.JWT_SEGREDO,
    sign: { expiresIn: "8h" },
  });

  app.setErrorHandler(tratadorDeErros);

  app.get("/saude", async () => ({ status: "ok", versao: "1.0.0" }));

  await app.register(rotasAutenticacao, { prefix: "/auth" });
  await app.register(rotasAssociados, { prefix: "/api/associados" });
  await app.register(rotasLojas, { prefix: "/api/lojas" });
  await app.register(rotasPermissoes, { prefix: "/api/permissoes" });
  await app.register(rotasReunioes, { prefix: "/api/reunioes" });
  await app.register(rotasMensalidades, { prefix: "/api/mensalidades" });
  await app.register(rotasDashboard, { prefix: "/api/dashboard" });
  await app.register(rotasApiPublica, { prefix: "/api/publico" });
  await app.register(rotasAuditoria, { prefix: "/api/auditoria" });
  await app.register(rotasProdutos, { prefix: "/api/produtos" });
  await app.register(rotasVendas, { prefix: "/api/vendas" });
  await app.register(rotasTransportes, { prefix: "/api/transportes" });

  await app.register(rotasAppAuth, { prefix: "/api/app/auth" });
  await app.register(rotasAppVitrine, { prefix: "/api/app/vitrine" });
  await app.register(rotasAppProdutos, { prefix: "/api/app/produtos" });
  await app.register(rotasAppPedidos, { prefix: "/api/app/pedidos" });
  await app.register(rotasAppFrete, { prefix: "/api/app/frete" });
  await app.register(rotasAppPagamento, { prefix: "/api/app/pagamento" });
  await app.register(rotasAppPerfil, { prefix: "/api/app/perfil" });

  return app;
}
