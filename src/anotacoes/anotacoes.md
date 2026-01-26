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