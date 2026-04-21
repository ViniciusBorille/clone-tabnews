# Automacao do fluxo Jira -> Branch -> PR -> Preview

Este repositorio foi preparado para um fluxo de desenvolvimento com Jira, GitHub, Vercel e Neon.

## Fluxo recomendado

1. A task nasce no Jira com chave, descricao e criterios de aceite.
2. A branch e criada a partir da issue:

```bash
npm run branch:name -- AGR-123 "cadastro de produtor"
```

3. O desenvolvimento acontece na branch da task.
4. Os checks locais sao executados:

```bash
npm run lint:prettier:check
npm run lint:eslint:check
npm test
```

5. O PR e aberto com o template do repositorio.
6. O GitHub Actions valida lint, commit messages, testes e contexto do PR.
7. A Vercel gera o Preview Deployment da branch.
8. O Neon fornece um banco isolado para preview.
9. Apos merge, a Vercel publica a producao na branch principal.

## O que foi preparado no codigo

- Suporte a `DATABASE_URL` em [infra/database.js](/C:/Development/agrdrive/infra/database.js:1)
- Leitura do nome do banco a partir da conexao, quando necessario, em [pages/api/v1/status/index.js](/C:/Development/agrdrive/pages/api/v1/status/index.js:1)
- Gerador de nome de branch em [infra/scripts/branch-name.js](/C:/Development/agrdrive/infra/scripts/branch-name.js:1)
- Regras operacionais para o agente em [AGENTS.md](/C:/Development/agrdrive/AGENTS.md:1)
- Template de PR em [.github/pull_request_template.md](/C:/Development/agrdrive/.github/pull_request_template.md:1)
- Validacao minima de contexto do PR em [.github/workflows/pr-context.yaml](/C:/Development/agrdrive/.github/workflows/pr-context.yaml:1)

## Configuracao recomendada da Vercel

Use a integracao Git da Vercel com o repositorio.

- Cada push em branch gera um Preview Deployment.
- Merge na branch de producao publica em producao.
- Ative comentarios da Vercel no PR se quiser expor a preview URL para o time.

Documentacao oficial:

- [Vercel Git Deployments](https://vercel.com/docs/deployments/git)
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

## Configuracao recomendada do Neon

O caminho mais simples e robusto e usar a integracao gerenciada entre Neon e Vercel.

- Ela cria uma branch de banco por preview automaticamente.
- Injeta `DATABASE_URL` no ambiente de preview da Vercel.
- Faz limpeza automatica quando o preview deixa de existir.

Documentacao oficial:

- [Neon-Managed Integration for Vercel](https://neon.com/docs/guides/vercel/)
- [Automate branching with GitHub Actions](https://neon.com/docs/guides/branching-github-actions)
- [Neon Create Branch GitHub Action](https://github.com/marketplace/actions/neon-create-branch-github-action)

Se voce preferir controlar tudo no GitHub Actions em vez da integracao da Vercel, use os actions oficiais do Neon com `NEON_API_KEY` e `NEON_PROJECT_ID`.

## Configuracao recomendada do Jira

Conecte o Jira ao GitHub e habilite Smart Commits.

- Commits, branches e PRs passam a aparecer na issue.
- Voce pode comentar, registrar tempo e transicionar issue por commit quando fizer sentido.

Documentacao oficial:

- [Enable Smart Commits](https://support.atlassian.com/jira-cloud-administration/docs/enable-smart-commits/)
- [Process work items with Smart Commits](https://support.atlassian.com/jira-software-cloud/docs/process-issues-with-smart-commits/)

## Segredos e variaveis sugeridos

Se usar somente Vercel Git + Neon Integration:

- configure os ambientes no painel da Vercel;
- nao e necessario armazenar `DATABASE_URL` no repositiorio;
- use `POSTGRES_*` apenas para desenvolvimento local.

Se usar GitHub Actions para criar e limpar branches do Neon:

- `NEON_API_KEY` em GitHub Secrets
- `NEON_PROJECT_ID` em GitHub Variables
- `VERCEL_TOKEN` apenas se optar por deploy manual via GitHub Actions

## Como o agente deve trabalhar

Ao receber uma task:

1. Ler a issue e identificar a chave.
2. Criar a branch com o utilitario do projeto.
3. Implementar a funcionalidade.
4. Adicionar ou atualizar testes em Jest.
5. Rodar lint e testes.
6. Separar commits por responsabilidade.
7. Abrir PR com contexto, testes e vinculo com o Jira.
