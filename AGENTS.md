# Workflow do Repositorio

## Objetivo

Este projeto usa Jira como fonte da tarefa e GitHub como fluxo de entrega.
Ao trabalhar em uma task, siga a sequencia abaixo:

1. Ler a issue do Jira, titulo, descricao e criterios de aceite.
2. Identificar a chave da issue, por exemplo `AGR-123`.
3. Gerar o nome da branch com `npm run branch:name -- <ISSUE-123> "titulo da tarefa"`.
4. Criar a branch a partir da `main`.
5. Implementar a funcionalidade com testes.
6. Rodar os checks locais antes de abrir o PR.
7. Fazer commits pequenos e semanticamente separados.
8. Abrir PR preenchendo o template do repositorio.

## Branches

- Use branches em `kebab-case`.
- Prefixe a branch com a chave da issue normalizada.
- Exemplo: `agr-123-cadastro-produtor`.

## Commits

- Use Conventional Commits.
- Prefira commits pequenos por responsabilidade.
- Exemplos:
  - `feat: add consultant creation endpoint`
  - `test: cover consultant creation validation`
  - `refactor: simplify session token parsing`

Se Smart Commits do Jira estiverem habilitados, voce pode adicionar a chave da issue no corpo do commit.

## Testes e validacoes

Antes de abrir o PR, rode:

```bash
npm run lint:prettier:check
npm run lint:eslint:check
npm test
```

## Banco e ambientes

- Localmente, o projeto usa `POSTGRES_*` com Docker.
- Em preview e producao, prefira `DATABASE_URL`.
- A integracao Vercel + Neon deve injetar a string de conexao por ambiente.

## Pull Request

- Referencie a issue do Jira no corpo do PR.
- Resuma o que mudou, impacto tecnico e testes executados.
- Inclua riscos, migrations e observacoes de deploy quando houver.
- Se houver Preview Deployment da Vercel, inclua a URL no PR.
