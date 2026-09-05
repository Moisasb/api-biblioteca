# API Biblioteca

API REST desenvolvida em NestJS e TypeScript para gerenciamento de uma biblioteca, com cadastro de livros, autores e autenticação de usuários.

## Funcionalidades

- Cadastro de usuários
- Login com JWT
- Hash de senhas com bcrypt
- Cadastro, consulta, atualização e remoção de livros
- Cadastro, consulta, atualização e remoção de autores
- Validação de dados com DTOs e `class-validator`
- Integração com MySQL
- Documentação com Swagger
- Estrutura modular baseada em NestJS

## Tecnologias

- NestJS 11
- TypeScript
- MySQL
- mysql2
- JWT
- bcrypt
- Swagger
- class-validator
- class-transformer

## Estrutura

```text
api-biblioteca/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   ├── auth.controller.ts
│   │   ├── auth.guard.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── autores/
│   │   ├── dto/
│   │   ├── autores.controller.ts
│   │   ├── autores.module.ts
│   │   └── autores.service.ts
│   ├── database/
│   ├── livros/
│   │   ├── dto/
│   │   ├── livros.controller.ts
│   │   ├── livros.module.ts
│   │   └── livros.service.ts
│   ├── app.module.ts
│   └── main.ts
├── frontend/
├── test/
├── biblioteca_db.sql
├── package.json
└── README.md
```

## Instalação

```bash
npm install
```

Configure as variáveis de ambiente necessárias para conexão com o MySQL e autenticação JWT.

## Banco de dados

O projeto possui o script `biblioteca_db.sql` para criação da estrutura do banco.

```bash
mysql -u root -p < biblioteca_db.sql
```

## Executar

```bash
npm run start:dev
```

Para produção:

```bash
npm run build
npm run start:prod
```

## Swagger

Após iniciar a API, acesse a documentação em:

```text
http://localhost:3000/api
```

## Autenticação

### Cadastro

```http
POST /auth/cadastro
Content-Type: application/json
```

### Login

```http
POST /auth/login
Content-Type: application/json
```

O login retorna um JWT para autenticação das operações protegidas.

## Livros

| Método | Rota | Descrição |
|---|---|---|
| POST | `/livros` | Cadastrar livro |
| GET | `/livros` | Listar livros |
| GET | `/livros/:id` | Buscar livro por ID |
| PUT | `/livros/:id` | Atualizar livro |
| DELETE | `/livros/:id` | Remover livro |

## Autores

| Método | Rota | Descrição |
|---|---|---|
| POST | `/autores` | Cadastrar autor |
| GET | `/autores` | Listar autores |
| GET | `/autores/:id` | Buscar autor por ID |
| PUT | `/autores/:id` | Atualizar autor |
| DELETE | `/autores/:id` | Remover autor |

## Validação e segurança

- IDs recebidos pela URL são convertidos e validados com `ParseIntPipe`.
- Dados de entrada são recebidos por DTOs.
- Senhas não devem ser armazenadas em texto puro.
- O JWT deve ser enviado no cabeçalho `Authorization: Bearer <token>` quando a rota estiver protegida.

## Testes

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Objetivo do projeto

Este projeto representa uma API de biblioteca organizada em módulos, demonstrando conceitos de NestJS, APIs REST, autenticação, validação, banco de dados relacional e documentação de endpoints.
