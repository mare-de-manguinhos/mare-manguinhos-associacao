# 🌊 Sistema de Associação de Pescadores (Maré Manguinhos)

Este projeto é uma solução fullstack completa desenvolvida para a gestão administrativa de uma associação de pescadores. O painel oferece controle total sobre associados, finanças, vendas e auditoria.

## 🔗 Links de Acesso
*   **Aplicação (Fullstack):** [associacao-mare-manguinhos.onrender.com](https://associacao-mare-manguinhos.onrender.com)
*   **API (Backend):** [mare-manguinhos-associacao.onrender.com](https://mare-manguinhos-associacao.onrender.com)

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
*   **React + Vite:** Interface moderna, rápida e responsiva.
*   **TypeScript:** Garantia de tipagem e maior segurança no desenvolvimento.

### **Backend**
*   **Node.js + Fastify:** Framework de alto desempenho e baixa sobrecarga.
*   **Prisma ORM:** Gerenciamento de banco de dados com produtividade.
*   **SQLite:** Banco de dados local para facilidade de deploy e testes.
*   **JWT (JSON Web Token):** Autenticação segura de usuários.

---

## 🚀 Funcionalidades Principais

### **Gestão Administrativa**
*   **Associados:** Cadastro e controle completo de membros.
*   **Permissões:** Controle de acesso baseado em cargos (RBAC).
*   **Mensalidades:** Gestão financeira de contribuições.
*   **Reuniões:** Agendamento e histórico de assembleias.
*   **Auditoria:** Log de ações para transparência administrativa.
*   **Dashboard:** Visão analítica dos dados da associação.

### **Operacional & Comercial**
*   **Lojas & Produtos:** Gestão de inventário e pontos de venda.
*   **Vendas:** Fluxo completo de comercialização.
*   **Transportes:** Monitoramento logístico.
*   **Integração:** Endpoints públicos mínimos para sistemas externos.

---

## 📂 Estrutura do Projeto

O repositório está dividido nas seguintes frentes principais:

*   📂 [`/docs`](docs): Arquivos Markdown e configuração do portal de documentação gerado pelo MkDocs.
*   📂 [`/frontend`](frontend): Código fonte da interface do usuário (React + Vite).
*   📂 [`/backend`](backend): Estrutura da API, modelos do banco e regras de negócio (Node.js + Prisma).

### 📚 Documentação (MkDocs) e Boas Práticas

Todas as documentações técnicas e regras do projeto estão agora integradas via **MkDocs**.
Para visualizar o portal de documentação localmente no seu navegador, rode no terminal:

```bash
python -m pip install mkdocs-material
python -m mkdocs serve
```

Você também pode consultar os arquivos Markdown diretamente:
1.  ⚖️ [**CONSTITUTIONS.md**](CONSTITUTIONS.md) - Regras fundamentais de desenvolvimento e boas práticas da equipe.
2.  📖 [**COMO_USAR.md**](COMO_USAR.md) - Instruções de instalação e execução.
3.  🏗️ [**ARQUITETURA.md**](ARQUITETURA.md) - Detalhes sobre o design do sistema (Backend/Frontend).
4.  🔌 [**API.md**](API.md) - Documentação dos endpoints, autenticação e integrações.

---

## 📝 Notas de Instalação Rápida

1.  Clone o repositório.
2.  Instale as dependências em ambas as pastas (`npm install`).
3.  Rode as migrações do Prisma no backend (`npx prisma migrate dev`).
4.  Inicie os serviços com `npm run dev`.
