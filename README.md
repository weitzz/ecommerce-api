# 🚀 Ecommerce API

API desenvolvida para um sistema de **e-commerce**, construída de forma incremental com o objetivo de aplicar e consolidar conhecimentos em backend moderno.

O projeto evoluiu ao longo do tempo com a adoção de novas tecnologias e práticas alinhadas às demandas do mercado, incluindo autenticação segura, validação de dados, criação e acompanhamento de transações de pagamento, documentação de APIs e testes automatizados.


## 🧩 Visão geral da stack

- **Prisma** – ORM utilizado para abstração e acesso ao banco de dados PostgreSQL, garantindo tipagem forte, migrations controladas e maior segurança na manipulação dos dados.

- **PostgreSQL** – Banco de dados relacional, executado em ambiente containerizado com **Docker**, facilitando a padronização do ambiente de desenvolvimento e deploy.

- **Stripe**  – Gateway de pagamento utilizado para criação e acompanhamento de transações financeiras, incluindo comunicação via webhooks.

- **JWT (JSON Web Token)** – Autenticação stateless implementada para controle de acesso às rotas protegidas, utilizando Access Token + Refresh Token para maior segurança e controle de sessão.

- **Refresh Token Rotantion** - Implementação de rotação segura de refresh tokens, invalidando o token anterior a cada renovação, mitigando ataques de reutilização (token replay attack) e aumentando a proteção contra sequestro de sessão.

- **Rate Limiting & Proteção contra Brute Force** - Mecanismo de limitação de requisições aplicado especialmente no endpoint de login, com bloqueio temporário após múltiplas tentativas inválidas, reduzindo riscos de ataques automatizados.

- **Cookies Seguros (httpOnly + secure)** - Refresh tokens armazenados em cookies httpOnly, com flag secure habilitada em produção, protegendo contra XSS e interceptação indevida.

- **Zod** - Biblioteca utilizada para validação e tipagem de schemas de entrada (DTOs), garantindo consistência de dados, tratamento estruturado de erros e maior segurança na validação de payloads da API.

- **CI/CD (GitHub Actions)** - Pipeline automatizado configurado para executar build, migrations e testes a cada push ou pull request, garantindo integridade do código e prevenindo deploy de versões quebradas.

- **Autenticação & Bcryptjs** – Fluxo completo de autenticação com criptografia segura de senhas, seguindo boas práticas de segurança e proteção de dados sensíveis.



## 📌 Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma 
- Zod
- JWT para autenticação
- Docker
- Swagger
- Stripe


## 📂 Estrutura do projeto

```bash
src/
 ├── controllers/
 ├── services/
 ├── libs/
 ├── routes/
 ├── schemas/
 ├── middlewares/
 ├── shared/
 ├── server.ts
 └── app.ts


```


## ⚙️ Pré-requisitos

Antes de iniciar o projeto, é necessário ter instalado:

- Node.js (LTS)
- Docker e Docker Compose
- Git



## 🔑 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
PORT=4000
API_URL=http://localhost:4000
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_KEY=whsec_xxxxxxxxxxxxx
FRONT_END_URL=http://localhost:3000
COOKIE_DOMAIN=

```

Gerar as chaves, no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
```env
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

## 🐳 Executando o banco de dados com Docker
```
docker-compose up -d
```

## ▶️ Executando a aplicação
```
# Instalar dependências
npm install

# Executar em ambiente de desenvolvimento
npm run dev

# API estará disponível em:

http://localhost:4000

```

## 🧪 Teste automatizados

O projeto possui atualmente testes unitários nas camadas de services e controllers, utilizando Jest e Supertest.

O ambiente de banco de dados de testes está configurado, permitindo a futura implementação de testes de integração.

```
npm run test

Ou

npm run test -- src/controllers

npm run test -- src/services
```

## 🔄 Fluxo de pagamento (Stripe)

1. O usuário inicia o processo de checkout no frontend.
2. A API cria a intenção de pagamento utilizando o Stripe.
3. O Stripe processa a transação.
4. Os webhooks do Stripe notificam a API sobre o status do pagamento.
5. A API atualiza o estado da transação no banco de dados.

## 📚 Documentação da API

A API é documentada utilizando Swagger, facilitando o entendimento das rotas, contratos, autenticação e exemplos de requisições.

```

http://localhost:4000/docs
```

## Render

Para subir essa API na Render como `Web Service`, use:

```bash
Build Command: npm install && npm run build
Start Command: npm start
Pre-Deploy Command: npm run db:migrate:deploy
```

Se o seu plano não tiver `Pre-Deploy Command`, rode `npm run db:migrate:deploy` manualmente antes de subir a nova versão.

Variáveis importantes para produção:

```env
NODE_ENV=production
PORT=10000
API_URL=https://sua-api.onrender.com
DATABASE_URL=postgresql://...
FRONT_END_URL=https://seu-frontend.onrender.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_KEY=whsec_...
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
COOKIE_DOMAIN=
```

Notas:

- `FRONT_END_URL` também controla o CORS da aplicação. Se tiver mais de um frontend, informe os domínios separados por vírgula.
- `COOKIE_DOMAIN` é opcional. Na Render, o mais seguro é deixar vazio, a menos que você realmente precise compartilhar cookie entre subdomínios.
- A aplicação já faz bind em `0.0.0.0`, que é o necessário para a Render.

## 🚧 Status do projeto

✔️ Autenticação com JWT  
✔️ Integração com Stripe (webhooks)  
✔️ Validação de dados com Zod  
✔️ Testes unitários (services e controllers)  
✔️ Documentação com Swagger
✔️ Refresh token
✔️ Rate limit
✔️ Testes de integração (planejado)  
✔️ Deploy em ambiente produtivo (planejado)


## 👩‍💻 Autor

Desenvolvido por **Tatiane Weitzel**  
[GitHub](https://github.com/weitzz) | [LinkedIn](https://linkedin.com/in/tatiane-weitzel/)