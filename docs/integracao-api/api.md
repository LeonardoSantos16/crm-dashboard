# Contrato da API

Referência dos endpoints que o `crm-dashboard` consome. Os exemplos foram capturados da API rodando com o seed e `REFERENCE_DATE=2026-10-15`. As regras por trás de cada resposta estão em [regras-de-negocio.md](regras-de-negocio.md), e as chamadas prontas, em [`requests.http`](../requests.http).

## Convenções

| Tema             | Regra                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Base             | `http://localhost:3333`. As rotas de negócio ficam sob `/api`; `/health` fica na raiz.                                                                       |
| Identidade       | Header `X-User-Id` com o id de um usuário de `GET /api/users`. Obrigatório em `/api/opportunities/**`. Ausente, inválido ou de usuário inexistente: **401**. |
| Hoje             | Toda resposta traz o header `X-Today` (`YYYY-MM-DD`), a data em São Paulo do relógio da API. O front usa esse dia, e não o do navegador.                     |
| Identificador    | As rotas usam o `id` numérico. Toda oportunidade traz também o `code` (`OPP-2003`).                                                                          |
| Datas            | Data de calendário como `YYYY-MM-DD` (`eventDate`, `dueDate`, `until`...). Instante como ISO 8601 em UTC (`stageEnteredAt`, `at`...).                        |
| Dinheiro         | `number` em reais, com até 2 casas (`4500`, `48.75`).                                                                                                        |
| Campos vazios    | `null`, nunca ausentes.                                                                                                                                      |
| Ids dos usuários | Mudam a cada seed. Busque-os em `GET /api/users`, sem fixá-los no front.                                                                                     |

## Endpoints

| Método  | Rota                               | Identidade | Sucesso                                                    |
| ------- | ---------------------------------- | :--------: | ---------------------------------------------------------- |
| `GET`   | `/health`                          |     —      | 200 `{ status, database }`                                 |
| `GET`   | `/api/users`                       |     —      | 200 `{ users: User[] }`                                    |
| `GET`   | `/api/opportunities`               |     ✓      | 200 `{ opportunities: OpportunityCard[], needsAttention }` |
| `POST`  | `/api/opportunities`               |     ✓      | **201** `OpportunityDetail`                                |
| `GET`   | `/api/opportunities/:id`           |     ✓      | 200 `OpportunityDetail`                                    |
| `PATCH` | `/api/opportunities/:id`           |     ✓      | 200 `OpportunityDetail`                                    |
| `POST`  | `/api/opportunities/:id/move`      |     ✓      | 200 `OpportunityDetail`                                    |
| `POST`  | `/api/opportunities/:id/lose`      |     ✓      | 200 `OpportunityDetail`                                    |
| `POST`  | `/api/opportunities/:id/follow-up` |     ✓      | 200 `OpportunityDetail`                                    |
| `POST`  | `/api/opportunities/:id/snooze`    |     ✓      | 200 `OpportunityDetail`                                    |
| `POST`  | `/api/opportunities/:id/comments`  |     ✓      | 200 `OpportunityDetail`                                    |

Toda ação responde com o detalhe já atualizado, inclusive `alert`, `moves` e `timeline`. O front não precisa buscar de novo.

### Visibilidade

- **Vendedor:** vê e altera só as próprias oportunidades.
- **Gestor:** vê e altera as do time (vendedores com `managerId` igual ao dele).
- Uma oportunidade fora da visibilidade responde **404**, igual a uma inexistente.

## Recursos

### `User`

```json
{ "id": 34, "name": "Ana", "role": "SELLER", "managerId": 33 }
```

`role`: `SELLER` ou `MANAGER`. O gestor tem `managerId: null`. O time do gestor é a lista de usuários com `managerId` igual ao `id` dele.

### `OpportunityDetail`

Exemplo: `GET /api/opportunities/2004` como Carla.

```json
{
  "id": 2004,
  "code": "OPP-2004",
  "company": { "id": 47, "name": "Agência Pulso" },
  "owner": { "id": 36, "name": "Carla" },
  "contactName": null,
  "contactPhone": null,
  "contactEmail": null,
  "estimatedValue": 3900,
  "items": [
    {
      "id": 47,
      "description": "Camiseta estampada",
      "quantity": 80,
      "unitValue": 48.75
    }
  ],
  "proposalValidUntil": "2026-10-10",
  "eventDate": "2026-11-05",
  "stage": "FOLLOW_UP",
  "stageEnteredAt": "2026-10-02T03:00:00.000Z",
  "lastContactAt": "2026-10-02T03:00:00.000Z",
  "nextFollowUpAt": null,
  "snoozedUntil": null,
  "snoozeCount": 0,
  "lossReason": null,
  "lossDetail": null,
  "alert": {
    "state": "ESCALATED",
    "dueDate": "2026-10-08",
    "idleDays": 13,
    "deadlineDays": 6,
    "consumedPct": 216.66666666666666
  },
  "moves": [
    {
      "stage": "FIRST_CONTACT",
      "allowed": false,
      "reason": "NO_RETURN_TO_FIRST_CONTACT"
    },
    { "stage": "BUDGET_PRESENTATION", "allowed": true },
    { "stage": "FORECAST", "allowed": true },
    { "stage": "CLOSING", "allowed": false, "reason": "ONLY_FROM_FORECAST" }
  ],
  "timeline": [
    {
      "type": "ESCALATED",
      "author": null,
      "at": "2026-10-15T03:00:00.000Z",
      "date": "2026-10-15",
      "cause": "DEADLINE"
    },
    {
      "type": "CREATED",
      "at": "2026-10-02T03:00:00.000Z",
      "author": null,
      "stage": "FOLLOW_UP"
    }
  ]
}
```

| Campo            | Significado                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `stage`          | `FIRST_CONTACT`, `BUDGET_PRESENTATION`, `FOLLOW_UP`, `FORECAST`, `CLOSING` ou `LOST`              |
| `lastContactAt`  | Último retorno registrado (no seed, o último contato do case)                                     |
| `nextFollowUpAt` | Próxima data escolhida no último retorno                                                          |
| `snoozedUntil`   | Adiamento ativo                                                                                   |
| `snoozeCount`    | Adiamentos seguidos desde o último retorno. Com `1`, o próximo adiamento escala (o diálogo avisa) |
| `lossReason`     | `PRICE`, `DELIVERY_TIME`, `COMPETITOR`, `NO_BUDGET`, `NO_RESPONSE` ou `OTHER`                     |
| `alert`          | `null` em Fechamento e Perdida. Ver [Alerta](#alerta)                                             |
| `moves`          | Um item por etapa do funil, exceto a atual. Ver [Movimentos](#movimentos)                         |
| `timeline`       | Da mais recente para a mais antiga. Ver [Timeline](#timeline)                                     |

### `OpportunityCard`

O item da listagem tem o mesmo formato do detalhe, **sem a `timeline`** e com `lostFromStage`: a etapa de onde uma oportunidade perdida saiu (`null` nas demais). Com "Mostrar perdidas", é a coluna onde o card aparece.

### Alerta

| Campo          | Significado                                                                                                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state`        | `ON_TIME` (Em dia), `ATTENTION` (Atrasada), `SNOOZED` (Adiada) ou `ESCALATED` (Escalonada)                                                                                         |
| `dueDate`      | Vencimento. No próprio dia ainda é `ON_TIME` ("Vence hoje")                                                                                                                        |
| `idleDays`     | Dias desde a última atividade ("Parada há N dias")                                                                                                                                 |
| `deadlineDays` | Prazo da etapa ("prazo da etapa: N dias" e "Sem data, o alerta volta em N dias")                                                                                                   |
| `consumedPct`  | Percentual do prazo consumido, sem arredondamento. Pode passar de 100 e ser negativo quando a próxima data passa do prazo. O front limita a barra a 0% e arredonda o valor exibido |

"Precisam de atenção" = `ATTENTION` + `ESCALATED`. Adiadas não contam.

### Movimentos

`{ stage, allowed, reason?, missing? }`

- `allowed: false` traz o `reason`, o código da regra que bloqueia, para o front traduzir.
- `allowed: true` com `missing` (`["estimatedValue", "items"]`) não é bloqueio: é o sinal para abrir o diálogo "Completar dados" e chamar o `/move` com `complete`.
- Perdida não aparece nos movimentos, porque tem ação própria (`/lose`).

| `reason`                     | Texto sugerido                                        |
| ---------------------------- | ----------------------------------------------------- |
| `FINAL_STAGE`                | Etapa final: não muda mais                            |
| `NO_RETURN_TO_FIRST_CONTACT` | Não volta para Primeiro Contato                       |
| `ONLY_FROM_FORECAST`         | Só a partir de Forecast                               |
| `RETURN_NOT_ALLOWED`         | Retorno não permitido                                 |
| `ONE_STEP_AT_A_TIME`         | Avança uma etapa por vez                              |
| `SAME_STAGE`                 | Já está nesta etapa (só na resposta do `/move`)       |
| `USE_LOSE_ACTION`            | Use "Marcar como perdida" (só na resposta do `/move`) |

### Timeline

Toda entrada tem `type`, `at` (instante) e `author` (`{ id, name }`, ou `null` no seed e no escalonamento).

| `type`         | Campos próprios                                                                     |
| -------------- | ----------------------------------------------------------------------------------- |
| `CREATED`      | `stage`                                                                             |
| `STAGE_CHANGE` | `fromStage`, `toStage`                                                              |
| `LOST`         | `fromStage`, `reason`, `detail`                                                     |
| `FOLLOW_UP`    | `channel` (`CALL`, `WHATSAPP`, `EMAIL`, `MEETING` ou `null`), `summary`, `nextDate` |
| `SNOOZE`       | `until`, `reason`                                                                   |
| `COMMENT`      | `body`                                                                              |
| `ESCALATED`    | `date`, `cause` (`DEADLINE` ou `SNOOZES`)                                           |

A entrada `ESCALATED` é calculada na leitura e só aparece enquanto o alerta estiver escalonado:

- `DEADLINE`: no dia seguinte a vencimento + prazo, às 00:00 de São Paulo;
- `SNOOZES`: no instante do 2º adiamento seguido, logo antes da entrada desse adiamento.

Exemplo de linha do tempo completa (da mais nova para a mais antiga):

```json
[
  {
    "type": "LOST",
    "at": "2026-10-15T13:35:25.248Z",
    "author": { "id": 34, "name": "Ana" },
    "fromStage": "BUDGET_PRESENTATION",
    "reason": "COMPETITOR",
    "detail": "Fechou com a Brindex"
  },
  {
    "type": "COMMENT",
    "at": "2026-10-15T13:35:25.214Z",
    "author": { "id": 34, "name": "Ana" },
    "body": "Cliente pediu amostra"
  },
  {
    "type": "SNOOZE",
    "at": "2026-10-15T13:35:25.184Z",
    "author": { "id": 34, "name": "Ana" },
    "until": "2026-10-18",
    "reason": "Cliente em viagem"
  },
  {
    "type": "FOLLOW_UP",
    "at": "2026-10-15T13:35:25.169Z",
    "author": { "id": 34, "name": "Ana" },
    "channel": "WHATSAPP",
    "summary": "Cliente pediu nova cor",
    "nextDate": "2026-10-20"
  },
  {
    "type": "STAGE_CHANGE",
    "at": "2026-10-15T13:35:25.138Z",
    "author": { "id": 34, "name": "Ana" },
    "fromStage": "FIRST_CONTACT",
    "toStage": "BUDGET_PRESENTATION"
  },
  {
    "type": "CREATED",
    "at": "2026-10-15T13:35:25.080Z",
    "author": { "id": 33, "name": "Marcos" },
    "stage": "FIRST_CONTACT"
  }
]
```

## Detalhe de cada endpoint

### `GET /api/opportunities`

| Parâmetro     | Valores                                        | Efeito                                                                                                                                                                                              |
| ------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`           | texto                                          | Código ou nome da empresa, sem diferenciar caixa nem acento (`clinica` encontra "Clínica Vida")                                                                                                     |
| `situation`   | `ON_TIME`, `ATTENTION`, `SNOOZED`, `ESCALATED` | Repita a chave para vários (`?situation=ATTENTION&situation=ESCALATED`). Com o filtro, Fechamento e Perdida ficam fora                                                                              |
| `ownerId`     | id                                             | Só gestor, com alguém do time. Vendedor, ou alguém de fora do time: **403**                                                                                                                         |
| `sort`        | `priority` (padrão), `value`                   | Prioridade: abertas por % do prazo consumido, depois valor, sem valor por último; depois Fechamento e Perdida, das mais recentes para as mais antigas. Valor: tudo pelo valor, sem valor por último |
| `allClosed`   | `true`, `false`                                | Fechamento sem o corte de 30 dias ("Ver todas")                                                                                                                                                     |
| `includeLost` | `true`, `false`                                | Inclui as perdidas dos últimos 30 dias ("Mostrar perdidas")                                                                                                                                         |

Por padrão, Fechamento traz só quem entrou na etapa nos últimos 30 dias, e Perdida não vem. `needsAttention` conta Atrasadas e Escalonadas do que o usuário vê, respeitando o `ownerId` e ignorando `q` e `situation`, para o contador não mudar durante a busca.

A lista vem ordenada, e o front só agrupa por `stage` (ou por `lostFromStage`, nas perdidas).

### `POST /api/opportunities`

```json
{
  "companyName": "Padaria Nova",
  "contactName": "Seu Zé",
  "contactPhone": "(11) 99999-0000",
  "contactEmail": "ze@padarianova.com",
  "ownerId": 34,
  "item": {
    "description": "Sacola ecológica",
    "quantity": 100,
    "unitValue": 12
  },
  "estimatedValue": 1200
}
```

- Obrigatórios: `companyName` e `contactName` (1 a 200 caracteres, com trim). O resto é opcional.
- `contactEmail` precisa ser um e-mail válido; `contactPhone` aceita até 30 caracteres.
- `quantity` é inteiro positivo; `unitValue` e `estimatedValue` são positivos.
- **Responsável:** o vendedor cria só para si (outro `ownerId` dá 403). O gestor precisa informar o `ownerId` (senão, 400) e escolher alguém do time (senão, 403).
- A empresa é reaproveitada pelo nome, sem diferenciar caixa.
- Nasce em Primeiro Contato, com a entrada `CREATED` (autor: quem criou).

### `PATCH /api/opportunities/:id`

Todos os campos são opcionais. Um campo ausente não muda, e `null` limpa o valor.

```json
{
  "companyName": "Banco Norte",
  "contactName": "Rita Souza",
  "contactPhone": null,
  "contactEmail": "rita@banconorte.com",
  "proposalValidUntil": "2026-10-22",
  "eventDate": null,
  "items": [
    { "description": "Agenda executiva", "quantity": 1000, "unitValue": 38 }
  ],
  "estimatedValue": 38000
}
```

- `companyName` e `contactName` não aceitam `null` nem vazio.
- `items` substitui a lista inteira.
- Datas aceitam o passado (proposta já vencida).
- Corpo vazio: 400.
- Em Orçamento, Follow-up e Forecast, deixar o valor nulo ou a lista vazia: **422** `MISSING_VALUE_OR_ITEMS`.
- Etapa final: **409** `FINAL_STAGE`.
- A edição não mexe no relógio do alerta e não entra na timeline.

### `POST /api/opportunities/:id/move`

```json
{
  "toStage": "BUDGET_PRESENTATION",
  "complete": {
    "estimatedValue": 4500,
    "items": [
      {
        "description": "Caneca personalizada",
        "quantity": 300,
        "unitValue": 15
      }
    ]
  }
}
```

- `complete` é opcional e serve para o diálogo "Completar dados". Se a transição for recusada, nada é salvo, nem o `complete`.
- Sucesso: a etapa muda, o relógio do alerta reinicia, o adiamento e a próxima data são limpos (`snoozeCount` continua) e entra um `STAGE_CHANGE`.
- Erros: 409 `INVALID_TRANSITION` com `details.reason`, 422 `MISSING_VALUE_OR_ITEMS` com `details.missing`, 409 `FINAL_STAGE` e 409 `STAGE_CONFLICT`.

### `POST /api/opportunities/:id/lose`

```json
{ "reason": "COMPETITOR", "detail": "Fechou com a Brindex" }
```

- `detail` passa por trim e aceita até 500 caracteres. É obrigatório quando `reason` é `OTHER`.
- Só em etapa não final (senão, 409 `FINAL_STAGE`). Entra uma entrada `LOST`.

### `POST /api/opportunities/:id/follow-up`

```json
{
  "channel": "WHATSAPP",
  "summary": "Cliente pediu nova cor",
  "nextDate": "2026-10-20"
}
```

- Todos os campos são opcionais (`{}` registra um retorno rápido).
- `summary` aceita até 500 caracteres.
- `nextDate` precisa ser **depois de hoje** e **até hoje + 30 dias**, contando a partir do `X-Today`.
- Efeito: `lastContactAt` = agora, `nextFollowUpAt` = a próxima data ou `null`, o adiamento é limpo e `snoozeCount` volta a 0.
- Em etapa final: 409 `FINAL_STAGE`.

### `POST /api/opportunities/:id/snooze`

```json
{ "until": "2026-10-22", "reason": "Cliente pediu contato depois da feira" }
```

- `until` é obrigatório e segue a mesma janela de datas do retorno. `reason` é opcional, com até 500 caracteres.
- Efeito: `snoozedUntil` = `until`, a próxima data é limpa e `snoozeCount` soma 1.
- Com `snoozeCount` chegando a 2, o alerta vira `ESCALATED` na hora.
- Em etapa final: 409 `FINAL_STAGE`.

### `POST /api/opportunities/:id/comments`

```json
{ "body": "Cliente pediu amostra" }
```

- `body` passa por trim e é obrigatório, com até 2000 caracteres.
- É aceito em qualquer etapa, inclusive final, e não mexe no alerta.

## Erros

Formato único:

```json
{
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "Stage transition not allowed",
    "details": { "reason": "ONLY_FROM_FORECAST" }
  }
}
```

A `message` é em inglês e serve para log. O front mostra o texto em pt-BR a partir do `code` e do `details`.

| Status | `code`                   | Quando                                                                              | `details`                                                   |
| ------ | ------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 400    | `VALIDATION_ERROR`       | Corpo ou parâmetros inválidos                                                       | Lista de problemas do zod: `[{ path, message, code, ... }]` |
| 400    | `INVALID_JSON`           | Corpo malformado                                                                    | —                                                           |
| 401    | `UNAUTHENTICATED`        | `X-User-Id` ausente, inválido ou de usuário inexistente                             | —                                                           |
| 403    | `FORBIDDEN`              | `ownerId` fora do permitido (filtro ou criação)                                     | —                                                           |
| 404    | `NOT_FOUND`              | Oportunidade inexistente ou fora da visibilidade, id inválido, rota inexistente     | —                                                           |
| 409    | `INVALID_TRANSITION`     | Movimento fora da matriz                                                            | `{ reason }`                                                |
| 409    | `FINAL_STAGE`            | Ação ou edição em Fechamento ou Perdida                                             | —                                                           |
| 409    | `STAGE_CONFLICT`         | A etapa mudou durante a requisição                                                  | —                                                           |
| 422    | `MISSING_VALUE_OR_ITEMS` | Entrar em Orçamento, ou editar da etapa Orçamento em diante, sem valor ou sem itens | `{ missing }`                                               |
| 500    | `INTERNAL_ERROR`         | Erro inesperado                                                                     | —                                                           |

Exemplo de `VALIDATION_ERROR`:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "origin": "string",
        "code": "too_small",
        "minimum": 1,
        "inclusive": true,
        "path": ["companyName"],
        "message": "Too small: expected string to have >=1 characters"
      }
    ]
  }
}
```

Para mostrar o erro ao lado do campo, use o `path` de cada item.
