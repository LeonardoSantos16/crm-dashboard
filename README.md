# crm-dashboard

Interface do CRM da Nobre Brindes: o funil de oportunidades em Kanban, com busca, filtros, detalhe da oportunidade e as ações do alerta de retorno.

Construída com Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 e TanStack Query. Os dados e todas as regras de negócio vêm da [`crm-api`](../crm-api), que fica num repositório separado.

## Pré-requisitos

- [Node.js 24](https://nodejs.org/) (versão definida em `.nvmrc`)
- A `crm-api` rodando com o seed (veja o README dela). Por padrão, ela sobe em `http://localhost:3333`.

## Como rodar

1. Suba a `crm-api` com o banco populado (`docker compose up -d`, `npm run db:deploy`, `npm run db:seed`, `npm run dev`). Com `REFERENCE_DATE=2026-10-15` no `.env` da API, o "hoje" é a data de referência do case.

2. Crie o arquivo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

   ```dotenv
   API_URL=http://localhost:3333
   ```

3. Instale as dependências e inicie o front:

   ```bash
   npm ci
   npm run dev
   ```

   Abra `http://localhost:3000`. A raiz redireciona para `/oportunidades`.

4. No seletor "Entrando como", escolha um usuário de demonstração:
   - **Ana, Bruno ou Carla** (vendedores): veem só as próprias oportunidades;
   - **Marcos** (gestor): vê as do time, com o filtro por vendedor e a inicial do responsável nos cards.

## Como testar

```bash
npm test            # testes do design system e dos componentes de feedback
npm run lint
npm run typecheck
npm run build
```

São as mesmas checagens do CI (`.github/workflows/ci.yml`).

## O que a interface faz

- **Quadro Kanban:** uma coluna por etapa (Primeiro Contato → Apresentação de Orçamento → Follow-up → Forecast → Fechamento), com a contagem de cards e de alertas em cada uma.
- **Busca e filtros:**
  - busca por código ou empresa;
  - atalho "Precisam de atenção";
  - filtro por situação (Atrasada, Adiada, Escalonada, Em dia);
  - filtro por vendedor (só para o gestor);
  - ordenação por prioridade ou por valor;
  - "Mostrar perdidas".
- **Consulta:** um clique no card abre o painel lateral com o resumo e as ações. "Abrir detalhes", ou um segundo clique no card, leva à página com os dados, os itens de brinde e a linha do tempo da oportunidade.
- **Mover de etapa:** arrastando o card no desktop, ou pelo menu "Mover para…" em qualquer tela. O menu mostra as etapas bloqueadas com o motivo. Se faltar valor ou item para entrar em Apresentação de Orçamento, ele abre o diálogo "Completar dados".
- **Alerta de retorno:** a automação do problema 4, descrita na seção seguinte. Além dela, dá para marcar como perdida e comentar na linha do tempo.
- **Estados:**
  - carregamento em skeleton;
  - erro com "Tentar novamente";
  - busca sem resultado e filtros sem resultado, cada um com a ação de limpar;
  - coluna vazia;
  - oportunidades atrasadas, escalonadas e adiadas marcadas no card.

## Automação: alerta de retorno (problema 4)

Dos quatro problemas do case, escolhi o 4: com alto volume de atendimentos, o vendedor esquece de dar retorno a um lead. O CRM **mostra** ao vendedor o que está parado e o que é mais urgente, e ele decide o que fazer. O sistema **não** contata o cliente no lugar dele.

A regra fica na `crm-api` e é coberta por testes de domínio e de rota. O README da API e o [`docs/regras-de-negocio.md`](../crm-api/docs/regras-de-negocio.md) têm os detalhes. No front, a automação aparece assim:

### Como o alerta funciona

- **Prazo por etapa:** cada etapa tem um prazo sem retorno (Primeiro Contato 1 dia, Orçamento 5, Follow-up 6 e Forecast 7). A contagem começa na entrada na etapa ou no último retorno, o que for mais recente.
- **Situações:**
  - **Em dia:** dentro do prazo, incluindo "Vence hoje";
  - **Atrasada:** passou do prazo;
  - **Escalonada:** passou mais um prazo inteiro sem retorno, ou foi adiada duas vezes seguidas;
  - **Adiada:** o vendedor escolheu uma data para voltar.
- **Calculado na consulta:** a API calcula o alerta a cada leitura, sem worker. A tela sempre mostra o estado real do dia.

### O que o vendedor vê

- **No card:** uma faixa com ícone e texto ("Parada 9 dias", "Escalonada", "Adiada · 22/10"). Cada coluna mostra quantos cards têm alerta.
- **Ordem do quadro:** as colunas vêm ordenadas pela prioridade da API, que é o percentual do prazo consumido, com o valor como desempate. O mais urgente fica no topo.
- **"Precisam de atenção":** filtra num clique as atrasadas e as escalonadas, com a contagem no botão. As adiadas ficam de fora, porque o vendedor já decidiu quando voltar a elas.
- **No painel e na página:** o resumo do alerta ("Parada há 9 dias · prazo da etapa: 5 dias", "Vence em 20/10"), e a linha do tempo com cada retorno, adiamento e escalonamento.

### O que o vendedor faz

- **Marcar como retornado:** é a ação principal do painel. O vendedor registra o canal (Ligação, WhatsApp, E-mail ou Reunião), um resumo e, se quiser, a próxima data, de até 30 dias. Sem data, o diálogo avisa quando o alerta volta, pelo prazo da etapa. O retorno reinicia a contagem e zera os adiamentos.
- **Adiar:** escolhe uma data de até 30 dias e, se quiser, um motivo. No segundo adiamento seguido, o diálogo avisa que a oportunidade vai ser escalonada para o gestor.
- **Gestor:** Marcos vê os alertas do time inteiro e pode filtrar por vendedor.
- **Estados finais:** "Marcar como retornado" e "Adiar" não aparecem em Fechamento nem em Perdida.

**Por que retornar e adiar são ações separadas:** as duas escolhem uma data. O que muda é se houve contato com o cliente. Se as duas fizessem a mesma coisa, o vendedor sempre escolheria a que não conta para o escalonamento.

## Decisões

O detalhamento está em [`openspec/changes/add-opportunity-funnel/design.md`](openspec/changes/add-opportunity-funnel/design.md), e os padrões de código, em [`docs/padroes.md`](docs/padroes.md).

### UX: encontrar rápido o que trabalhar hoje

- **Prioridade como ordem padrão:** cada coluna vem ordenada pela urgência que a API calcula (percentual do prazo consumido, com o valor como desempate). O que precisa de atenção fica no topo.
- **"Precisam de atenção" num clique:** o atalho filtra as atrasadas e as escalonadas. As adiadas ficam fora da contagem, porque o vendedor já decidiu quando voltar a elas.
- **Estado nunca só por cor:** todo estado mostra ícone e texto em pt-BR ("Parada há 9 dias", "Escalonada", "Adiada até 22/10").
- **Painel antes da página:** o painel lateral resolve a maioria das ações sem tirar o vendedor do quadro.
- **Filtros e painel na URL:** busca, filtros e o card aberto ficam nos search params, então um link compartilhado abre a mesma visão.
- **Evento do cliente e proposta vencida:** o card avisa quando o evento do cliente está a 7 dias ou menos, e o painel mostra "Vencida há N dias" na validade da proposta. As duas coisas são informação, não alerta.
- **Campos vazios do case:** aparecem como "Não informado". Um traço é mal lido por leitores de tela.

### Engenharia

- **Movimento otimista com rollback:** o card muda de coluna na hora. Se a API recusar, ele volta ao lugar e um toast mostra o motivo.
- **Dados no cliente com TanStack Query e axios:** um rewrite no `next.config.ts` envia `/api/*` para a `crm-api`. O navegador fala com a própria origem, sem CORS já que não temos um ambiente de produção.
- **"Hoje" vem da API:** o header `X-Today` define o dia usado em "Vencida há N dias", no aviso de evento e nos limites de data dos diálogos. O relógio do navegador nunca é usado.
- **Drag com `@dnd-kit`:** sensores de ponteiro e anúncios em pt-BR para leitores de tela. Abaixo de 768px o arraste fica desligado, e "Mover para…" é o caminho.
- **Diálogos e menus com Radix:** foco preso, Escape e ARIA prontos, estilizados com os tokens.
- **Design system com tokens:** cores, fontes, raios e sombras ficam só no `@theme` de `src/app/globals.css`. O `npm test` falha com cor fora dos tokens e confere o contraste dos pares de cor. `/design-tokens` (só em desenvolvimento) mostra os tokens e os padrões de feedback.

### Segurança

- **Identidade de demonstração:** o usuário escolhido fica no `localStorage` e vai para a API no header `X-User-Id`. A visibilidade (vendedor vê as próprias oportunidades, gestor vê as do time) é aplicada pela API, não pela tela.
- **Em produção:** o seletor de identidade sairia. O front faria login num provedor de identidade e enviaria um token (JWT) que a API valida em toda requisição.
- **Sem credenciais no repositório:** o `.env` não é versionado, e o front só conhece a URL da API.

## Limitações conhecidas

- **Arraste parcial:** as colunas proibidas não ficam esmaecidas durante o arraste, e não há área para soltar como perdida. Soltar numa etapa com dados faltando é recusado, e o diálogo "Completar dados" abre só pelo "Mover para…".
- **Sem criação e edição de oportunidades:** os endpoints existem na API, mas os formulários ficaram para uma próxima entrega.
- **Mobile mínimo:** as telas funcionam a 375px sem rolagem horizontal da página, e o quadro rola dentro da própria área. Abas por etapa, barra inferior e filtros em bottom sheet ficaram de fora.
- **Testes:** os testes automatizados cobrem o design system e os componentes de feedback. Os fluxos do quadro foram verificados no navegador, seguindo os cenários das specs. Os testes de componentes e de fluxo seriam o próximo passo.
- **Tipos duplicados:** `src/types/api.ts` é uma cópia de `docs/integracao-api/crm-api-front-types.ts` e precisa ser atualizado à mão quando o contrato da API mudar.
- **Sem fila de retornos, visão do time e notificações:** estão especificadas na change [`add-follow-up-alerts`](openspec/changes/add-follow-up-alerts/proposal.md).

## Estrutura

```
src/
├── app/
│   ├── (crm)/oportunidades/   # quadro, painel e página de detalhe
│   └── design-tokens/         # vitrine dos tokens (só em desenvolvimento)
├── components/                # feedback, formulários, ações da oportunidade
├── hooks/                     # uma consulta ou ação da API por hook
├── lib/                       # axios, queryClient e o store do "hoje"
├── types/                     # contrato da crm-api
└── utils/                     # datas, formatação, rótulos em pt-BR, erros da API
docs/                          # case, contrato da API e padrões de código
openspec/                      # specs e changes (proposta, design e tarefas)
tests/                         # testes do design system
```

## Uso de IA

O projeto foi desenvolvido com o Claude Code, num fluxo de especificação antes do código (SDD):

- **OpenSpec:** cada entrega começou como uma change em `openspec/changes/`, com proposta, design, specs e tarefas. As decisões de tela saíram de uma entrevista de design registrada no `design.md` utilizando a skill grill-me. utilizei o OpenSpec para implementar uma abordagem SDD no projeto.
- **Claude Design:** os wireframes do `design.md` foram protótipos no Claude Design. Os ajustes aceitos entraram nos tokens do `@theme` e na spec do design system, nunca direto num componente.
- **Commits e PRs:** textos de PRs e mensagens de commit escritos com auxílio do Claude Code, que também sugeriu e aplicou, a meu pedido, o agrupamento das alterações em commits e/ou ammends
- **Design system:** os design tokens dos sites nobrebrindes.com.br e coroadefloresnobre.com.br foram extraídos com o auxílio do Claude Code e serviram de base para a montagem do design system
- **Implementação:** por falta de tempo, muitos componentes e hooks foram gerados inicialmente com o Claude Code (a partir das specs e protótipo em uma abordagem SDD) e depois refatorados por mim. Em um fluxo normal, eu usaria o Claude Code apenas para extrair o CSS e criaria os componentes manualmente. Isso evitaria o retrabalhado

