 # Testes unitários (services, utils, etc.)

 
│# Testes de integração (routes, controllers)

--authMiddleware mudar para jwt token 


🧠 Regra mental pra nunca errar

Controller valida
Service normaliza
Prisma persiste


Regra de ouro (pra você guardar)
Camada	Responsabilidade
--------------------------------

Service => 	buscar + filtrar + paginar
Controller =>	adaptar resposta ao cliente
Utils => 	helpers (URL, parse, etc)


# Ordem CORRETA (essa semana)

### Dia 1

✅ Padronizar resposta da API (desenhar o contrato de resposta ideal)

✅ Ajustar controllers

### Dia 2

✅ Criar `AppError`

✅ Middleware global

✅ Ajustar services

### Dia 3

✅ Aplicar Zod em 1 ou 2 endpoints

(não tudo)

### Dia 4–5 (se sobrar tempo)

🔒 Refresh token


src/
 ├─ shared/
 │   ├─ api-response.ts
 │   ├─ errors/
 │   │   └─ app-error.ts
 │   └─ http/
 │       └─ status-codes.ts


