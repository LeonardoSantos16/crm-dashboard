# Design

## Context

- **Stack:** Next.js 16.4.2 (App Router, `cacheComponents: true`), React 19.3, TypeScript, Tailwind CSS 4. Every style comes from the `@theme` tokens and follows `openspec/specs/design-system/spec.md`.
- **Current screens:** none. `app/page.tsx` is still the create-next-app placeholder.
- **Existing components:** `components/feedback/` already has `StatusBadge` (with `pickAlertState`), `Skeleton`, `ErrorState`, and `EmptyState`.
- **No API yet:** the case asks for a Node.js REST API with PostgreSQL. It does not exist yet, and this change does not build it.
- **Business rules:** the alert and follow-up behavior comes from the decision document "Case CRM — Automação & Qualidade: decisões". This change uses decisions 4, 7, 8, 11, 12 to 15, and 16.
- **Interview:** the screen decisions below come from a design interview held on 2026-10-23. See proposal.md for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Wireframes complete enough for Claude Design to prototype every screen, state, and dialog of the funnel without guessing.
- One interaction model for the board on desktop, mobile, and keyboard.
- A front end that works before the API exists and switches to it without changes to the screens.

**Non-Goals:**
- Visual polish. The wireframes fix structure, content, and pt-BR copy. Claude Design decides spacing and visual weight within the design system.
- The Retornos, Time, and notification screens (`add-follow-up-alerts`).
- Server-side alert computation and transition validation. The API owns them.

## Wireframes

### How to read them

- **Data:** the sample data comes from the case (reference date 15/10/2026). The alert states on it are illustrative.
- **Example stage deadlines:** Primeiro Contato 1 day, Apresentação de Orçamento 5, Follow-up 6, Forecast 7. The real values are an open question.
- **Text:** all pt-BR strings are final copy unless marked otherwise. Lowercase text in parentheses, such as "(card em movimento)", is a note for the designer, not UI text.
- **Viewport:** desktop wireframes assume 1280px or wider, and mobile ones 375px.

| Mark | Meaning |
|---|---|
| `(!)` | Atenção (`clock-alert` icon, attention tones) |
| `(^)` | Escalonada (`siren`, escalated tones) |
| `(z)` | Adiada (`alarm-clock-off`, snoozed tones) |
| `(x)` | Perdida (`circle-x`, lost tones) |
| `(/)` | Not allowed (`ban` icon) |
| `(i)` | Information (`info` icon, neutral tones) |
| `(→) (↩) (✎) (+)` | Timeline types: stage change, follow-up, comment, created |
| `[Texto]` | Button. `[Texto ▾]` is a select or menu. |
| `[_____]` | Text field. `*` marks a required field. |
| `( )` `(•)` | Radio, off and on. `[ ]` is a checkbox. |
| `‾‾‾` | Active tab (underline plus `aria-current`) |
| `░` | Dimmed area |
| `▒` | Skeleton placeholder |
| `A` `B` `C` on a card | Owner initial, shown to managers only |

### W1. Oportunidades: board (manager view)

The manager view shows every element. A salesperson sees the same screen with three differences: no "Time" tab, no "Vendedor" filter, and no owner initials on cards. "Precisam de atenção (2)" counts attention and escalated cards. Snoozed cards are not counted, because the salesperson already decided when to come back to them.

```text
+----------------------------------------------------------------------------------------------------------------------------------------------+
| ♛ Nobre CRM         Oportunidades   Retornos   Time                        [+ Nova oportunidade]   [sino]   Entrando como: Marcos (gestor) ▾ |
|                     ‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                          MODO DEMONSTRAÇÃO |
+----------------------------------------------------------------------------------------------------------------------------------------------+
+----------------------------------------------------------------------------------------------------------------------------------------------+
| [Buscar por código ou empresa         ]   [(!) Precisam de atenção (2)]   Situação: (Atrasada) (Adiada) (Escalonada) (Em dia)                |
| Vendedor: [Todos ▾]   Ordenar por: [Prioridade ▾]   ( ) Mostrar perdidas                                                                     |
+----------------------------------------------------------------------------------------------------------------------------------------------+

+--------------------------+ +--------------------------+ +--------------------------+ +--------------------------+ +--------------------------+
| PRIMEIRO CONTATO         | | APRESENTAÇÃO DE          | | FOLLOW-UP                | | FORECAST                 | | FECHAMENTO               |
|                          | | ORÇAMENTO                | |                          | |                          | | últimos 30 dias          |
| 1                        | | 1 · (!) 1 com alerta     | | 2 · (!) 1 com alerta     | | 1                        | | 1                        |
|--------------------------| |--------------------------| |--------------------------| |--------------------------| |--------------------------|
| +----------------------+ | | +----------------------+ | | +----------------------+ | | +----------------------+ | | +----------------------+ |
| | OPP-2001           A | | | | OPP-2002           B | | | | OPP-2004           C | | | | OPP-2005           B | | | | OPP-2006           C | |
| | Tech Alpha Ltda      | | | | Construtora Horizon… | | | | Agência Pulso        | | | | Banco Norte          | | | | Escola Saber         | |
| | R$ 4.500             | | | | R$ 9.800             | | | | R$ 3.900             | | | | R$ 38.000            | | | | R$ 11.500            | |
| | Caneca person. · 300 | | | | Kit escritório · 120 | | | | Camiseta est. · 80   | | | | Agenda exec. · 1.000 | | | | Mochila inf. · 250   | |
| +----------------------+ | | | (!) Parada 9 dias    | | | | (^) Escalonada       | | | | (z) Adiada · 22/10   | | | +----------------------+ |
+--------------------------+ | +----------------------+ | | +----------------------+ | | +----------------------+ | |                          |
                             +--------------------------+ |                          | +--------------------------+ | Ver todas →              |
                                                          | +----------------------+ |                              +--------------------------+
                                                          | | OPP-2003           A | |
                                                          | | Clínica Vida         | |
                                                          | | R$ 7.200             | |
                                                          | | Squeeze pers. · 500  | |
                                                          | | Evento em 18/10      | |
                                                          | +----------------------+ |
                                                          +--------------------------+
```

### W2. Board while dragging

OPP-2003 is being dragged from Follow-up:
- **Forecast:** a valid target, showing a drop slot.
- **Fechamento:** dimmed, with the reason.
- **Lost drop area:** appears below the board only during the drag.

Which other columns are dimmed depends on the stage-return rule, which is still open. The wireframe shows only the one rule already known.

```text
+--------------------------+ +--------------------------+ +--------------------------+ +--------------------------+ +--------------------------+
| PRIMEIRO CONTATO         | | APRESENTAÇÃO DE          | | FOLLOW-UP                | | FORECAST                 | | FECHAMENTO               |
|                          | | ORÇAMENTO                | |                          | |                          | |                          |
| 1                        | | 1 · (!) 1 com alerta     | | 2 · (!) 1 com alerta     | | 1                        | |                          |
|--------------------------| |--------------------------| |--------------------------| |--------------------------| |--------------------------|
| +----------------------+ | | +----------------------+ | | +----------------------+ | | +----------------------+ | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
| | OPP-2001           A | | | | OPP-2002           B | | | | OPP-2004           C | | | | OPP-2005           B | | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
| | Tech Alpha Ltda      | | | | Construtora Horizon… | | | | Agência Pulso        | | | | Banco Norte          | | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
| | R$ 4.500             | | | | R$ 9.800             | | | | R$ 3.900             | | | | R$ 38.000            | | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
| | Caneca person. · 300 | | | | Kit escritório · 120 | | | | Camiseta est. · 80   | | | | Agenda exec. · 1.000 | | | (/) Só a partir de       |
| +----------------------+ | | | (!) Parada 9 dias    | | | | (^) Escalonada       | | | | (z) Adiada · 22/10   | | |     Forecast             |
+--------------------------+ | +----------------------+ | | +----------------------+ | | +----------------------+ | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
                             +--------------------------+ |                          | |                          | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
                                                          | (card em movimento)      | | +----------------------+ | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
                                                          +--------------------------+ | | ┆ soltar aqui        | | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
                                                                                       | | ┆ OPP-2003           | | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
                                                                                       | | ┆ Clínica Vida       | | | ░░░░░░░░░░░░░░░░░░░░░░░░ |
                                                                                       | +----------------------+ | +--------------------------+
                                                                                       +--------------------------+

+----------------------------------------------------------------------------------------------------------------------------------------------+
|                                              (x) Solte aqui para marcar como perdida                                                         |
+----------------------------------------------------------------------------------------------------------------------------------------------+
```

### W3. Board states

**Loading**

```text
+--------------------------+ +--------------------------+ +--------------------------+   (… mais 2 colunas iguais)
| PRIMEIRO CONTATO         | | APRESENTAÇÃO DE          | | FOLLOW-UP                |
|                          | |                          | |                          |
| ▒▒                       | | ▒▒                       | | ▒▒                       |
|--------------------------| |--------------------------| |--------------------------|
| +----------------------+ | | +----------------------+ | | +----------------------+ |
| | ▒▒▒▒▒▒▒▒             | | | | ▒▒▒▒▒▒▒▒             | | | | ▒▒▒▒▒▒▒▒             | |
| | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒       | | | | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒       | | | | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒       | |
| | ▒▒▒▒▒                | | | | ▒▒▒▒▒                | | | | ▒▒▒▒▒                | |
| +----------------------+ | | +----------------------+ | | +----------------------+ |
|                          | |                          | |                          |
| +----------------------+ | | +----------------------+ | | +----------------------+ |
| | ▒▒▒▒▒▒▒▒             | | | | ▒▒▒▒▒▒▒▒             | | | | ▒▒▒▒▒▒▒▒             | |
| | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒       | | | | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒       | | | | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒       | |
| | ▒▒▒▒▒                | | | | ▒▒▒▒▒                | | | | ▒▒▒▒▒                | |
| +----------------------+ | | +----------------------+ | | +----------------------+ |
|                          | |                          | |                          |
| +----------------------+ | | +----------------------+ | | +----------------------+ |
| | ▒▒▒▒▒▒▒▒             | | | | ▒▒▒▒▒▒▒▒             | | | | ▒▒▒▒▒▒▒▒             | |
| | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒       | | | | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒       | | | | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒       | |
| | ▒▒▒▒▒                | | | | ▒▒▒▒▒                | | | | ▒▒▒▒▒                | |
| +----------------------+ | | +----------------------+ | | +----------------------+ |
+--------------------------+ +--------------------------+ +--------------------------+
aria-busy="true" · leitor de tela: "Carregando oportunidades" · sem animação com movimento reduzido
```

**Load failure**

```text
+----------------------------------------------------------------------------------------+
|                                                                                        |
| (!) Não foi possível carregar as oportunidades.                                        |
|     Verifique sua conexão e tente de novo.                                             |
|                                                                                        |
|     [Tentar novamente]                                                                 |
|                                                                                        |
| role="alert" · tons de erro · ocupa o lugar do quadro;                                 |
| barra superior e filtros continuam visíveis                                            |
+----------------------------------------------------------------------------------------+
```

**Search with no match**

```text
+----------------------------------------------------------------------------------------+
| [xyz                                   ]  ← busca ativa                                |
|----------------------------------------------------------------------------------------|
|                                                                                        |
| (lupa) Nenhuma oportunidade encontrada para “xyz”.                                     |
|                                                                                        |
|        [Limpar busca]                                                                  |
|                                                                                        |
| tons neutros, sem cor de erro · com filtros ativos o texto é                           |
| "Nenhuma oportunidade com esses filtros." e a ação é [Limpar filtros]                  |
+----------------------------------------------------------------------------------------+
```

**User with no opportunities**

```text
+----------------------------------------------------------------------------------------+
|                                                                                        |
| (pasta) Você ainda não tem oportunidades.                                              |
|         Cadastre a primeira para começar a acompanhar o funil.                         |
|                                                                                        |
|         [+ Nova oportunidade]                                                          |
|                                                                                        |
+----------------------------------------------------------------------------------------+
```

**Empty column**

```text
+--------------------------+
| FORECAST                 |
|                          |
| 0                        |
|--------------------------|
|                          |
| Nenhuma oportunidade     |
| nesta etapa              |
|                          |
+--------------------------+
```

### W4. Board on mobile

Cards are not draggable on mobile. Tapping a card opens the full-screen panel, which holds "Mover para…". The "Filtros" button opens the bottom sheet, and "≡" opens the menu with the identity selector.

```text
+----------------------------------------+
| ♛ Nobre CRM           [+]  [sino]  [≡] |
|----------------------------------------|
| [Buscar código ou empresa] [Filtros·1] |
| [(!) Precisam de atenção (2)]          |
|----------------------------------------|
| ‹ Orçam. 1 │ FOLLOW-UP 2 │ Forecast 1› |
|              ‾‾‾‾‾‾‾‾‾‾‾               |
| (!) 1 com alerta                       |
| +------------------------------------+ |
| | OPP-2004                         C | |
| | Agência Pulso                      | |
| | R$ 3.900                           | |
| | Camiseta estampada · 80            | |
| | (^) Escalonada                     | |
| +------------------------------------+ |
| +------------------------------------+ |
| | OPP-2003                         A | |
| | Clínica Vida                       | |
| | R$ 7.200                           | |
| | Squeeze personalizado · 500        | |
| | Evento em 18/10                    | |
| +------------------------------------+ |
|                                        |
|----------------------------------------|
| ▦ Oportunidades   ↩ Retornos   ≣ Time  |
|   ‾‾‾‾‾‾‾‾‾‾‾‾‾                        |
+----------------------------------------+
```

```text
+----------------------------------------+
| Filtros                            [X] |
|----------------------------------------|
| SITUAÇÃO                               |
| [Atrasada] [Adiada] [Escalonada]       |
| [Em dia]                               |
|                                        |
| VENDEDOR (só gestor)                   |
| [Todos                             ▾]  |
|                                        |
| ORDENAR POR                            |
| (•) Prioridade   ( ) Valor             |
|                                        |
| [ ] Mostrar perdidas                   |
|----------------------------------------|
| [Limpar]         [Ver 6 oportunidades] |
+----------------------------------------+
```

```text
+----------------------------------------+
| Menu                               [X] |
|----------------------------------------|
| ENTRANDO COMO (MODO DEMONSTRAÇÃO)      |
| ( ) Ana · vendedora                    |
| ( ) Bruno · vendedor                   |
| ( ) Carla · vendedora                  |
| (•) Marcos · gestor                    |
+----------------------------------------+
```

### W5. Side panel

The panel opens on the right, about 420px wide, over the board. The open card gets a highlighted border. Clicking the same card again, or "Abrir detalhes", goes to the detail page. On mobile, the panel fills the screen.

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| ♛ Nobre CRM         Oportunidades   Retornos   Time            [+ Nova oportunidade]   [sino]   Entrando como: Marcos (gestor) ▾ |
|                     ‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                              MODO DEMONSTRAÇÃO |
+----------------------------------------------------------------------------------------------------------------------------------+
+------------------------------------------------------------------------------+ +------------------------------------------------+
| (quadro continua visível e utilizável)                                       | | OPP-2002                                   [X] |
|                                                                              | | Construtora Horizonte                          |
| PRIMEIRO CONTATO   APRESENTAÇÃO DE    FOLLOW-UP                              | | (!) Atenção                                    |
|                    ORÇAMENTO                                                 | | Parada há 9 dias · prazo da etapa: 5 dias      |
| +--------------+   +==============+   +--------------+                       | |------------------------------------------------|
| | OPP-2001     |   ‖ OPP-2002     ‖   | OPP-2004     |                       | | ETAPA           Apresentação de Orçamento      |
| | Tech Alpha   |   ‖ Construtora… ‖   | Agência Pul… |                       | | VALOR ESTIMADO  R$ 9.800,00                    |
| +--------------+   +==============+   +--------------+                       | | BRINDE          Kit escritório · 120           |
|                    ↑ card aberto, borda destacada                            | | VENDEDOR        Bruno                          |
+------------------------------------------------------------------------------+ | CONTATO         Não informado                  |
                                                                                 |------------------------------------------------|
                                                                                 | ÚLTIMO CONTATO  06/10/2026                     |
                                                                                 | VALIDADE        13/10/2026                     |
                                                                                 | EVENTO          25/10/2026                     |
                                                                                 |------------------------------------------------|
                                                                                 | [Marcar como retornado]   [Adiar]              |
                                                                                 | [Mover para… ▾]   [Marcar como perdida]        |
                                                                                 |                                                |
                                                                                 | [Abrir detalhes →]                             |
                                                                                 +------------------------------------------------+
```

**Variant: missing data blocks the next stage.** "Completar dados" opens the same dialog as W9.

```text
+------------------------------------------------+
| OPP-2008                                   [X] |
| Gráfica Ponto                                  |
|------------------------------------------------|
| (i) Falta valor estimado e item de brinde      |
|     para enviar orçamento.  [Completar dados]  |
|------------------------------------------------|
| ETAPA           Primeiro Contato               |
| VALOR ESTIMADO  Não informado                  |
| BRINDE          Não informado                  |
+------------------------------------------------+
```

**"Mover para…" menu**

```text
+--------------------------------------------------+
| Mover para…                                      |
|--------------------------------------------------|
|   Primeiro Contato                               |
|   Apresentação de Orçamento                      |
| ✓ Follow-up                          etapa atual |
|   Forecast                                       |
|   Fechamento (desabilitado)                      |
|     (/) Só a partir de Forecast                  |
+--------------------------------------------------+
```

### W6. Detail page

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| ♛ Nobre CRM         Oportunidades   Retornos   Time            [+ Nova oportunidade]   [sino]   Entrando como: Marcos (gestor) ▾ |
|                     ‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                              MODO DEMONSTRAÇÃO |
+----------------------------------------------------------------------------------------------------------------------------------+
+----------------------------------------------------------------------------------------------------------------------------------+
| ← Oportunidades                                                                                                                  |
|                                                                                                                                  |
| OPP-2005 · Banco Norte                                     [Marcar como retornado] [Adiar] [Mover para… ▾] [Marcar como perdida] |
| (z) Adiada · até 22/10 · "Cliente em viagem até 21/10"                                                                           |
+----------------------------------------------------------------------------------------------------------------------------------+
+------------------------------------------------------------+  +----------------------------------------------------------------+
| DADOS                                             [Editar] |  | ATIVIDADE                                                      |
|------------------------------------------------------------|  |----------------------------------------------------------------|
| EMPRESA          Banco Norte                               |  | [Escreva um comentário…                            ]           |
| CONTATO          Não informado                             |  |                                                     [Comentar] |
| TELEFONE         Não informado                             |  |----------------------------------------------------------------|
| E-MAIL           Não informado                             |  | (z) Adiada até 22/10 · "Cliente em viagem até 21/10"           |
| VENDEDOR         Bruno                                     |  |     Bruno · 15/10/2026 10:12                                   |
| ETAPA            Forecast · desde 10/10/2026               |  |                                                                |
| VALOR ESTIMADO   R$ 38.000,00                              |  | (✎) "Pediu 1.000 unidades com logo em dourado."                |
|------------------------------------------------------------|  |     Bruno · 12/10/2026 16:40                                   |
| DATAS                                                      |  |                                                                |
| ÚLTIMO CONTATO   15/10/2026                                |  | (→) Follow-up → Forecast                                       |
| VALIDADE         22/10/2026                                |  |     Bruno · 10/10/2026 09:30                                   |
| EVENTO           12/12/2026                                |  |                                                                |
|------------------------------------------------------------|  | (↩) Retornado · Ligação · "Aprovou o orçamento."               |
| ITENS DE BRINDE                                            |  |     Bruno · 10/10/2026 09:25                                   |
| BRINDE                 QTD.   VALOR UN.     TOTAL          |  |                                                                |
| Agenda executiva      1.000   R$ 38,00   R$ 38.000,00      |  | (+) Oportunidade criada em Primeiro Contato                    |
+------------------------------------------------------------+  |     Bruno · 01/10/2026 11:02                                   |
                                                                +----------------------------------------------------------------+
```

### W7. Detail page on mobile

```text
+----------------------------------------+
| ← Oportunidades                        |
| OPP-2005 · Banco Norte                 |
| (z) Adiada · até 22/10                 |
|----------------------------------------|
| [ DADOS ]  ATIVIDADE                   |
|  ‾‾‾‾‾‾‾                               |
| EMPRESA         Banco Norte            |
| CONTATO         Não informado          |
| VALOR ESTIMADO  R$ 38.000,00           |
| …                                      |
|                               [Editar] |
|----------------------------------------|
| [Retornado] [Adiar] [Mover ▾] [⋯]      |
| barra de ações fixa acima da           |
| navegação inferior;                    |
| [⋯] abre "Marcar como perdida"         |
+----------------------------------------+
```

### W8. Edit modal

```text
+--------------------------------------------------------------+
| Editar OPP-2005                                          [X] |
|--------------------------------------------------------------|
| Empresa *                                                    |
| [Banco Norte                                         ]       |
| Contato                     Telefone                         |
| [                        ]  [                        ]       |
| E-mail                                                       |
| [                                                    ]       |
| Validade da proposta        Evento do cliente                |
| [22/10/2026      ]          [12/12/2026      ]               |
|--------------------------------------------------------------|
| ITENS DE BRINDE                                              |
| Brinde                    Qtd.     Valor un.                 |
| [Agenda executiva     ]  [1000 ]  [R$ 38,00  ]   [x]         |
| [+ Adicionar item]                                           |
|                                                              |
| Valor estimado *                                             |
| [R$ 38.000,00        ]                                       |
| Sugestão pelos itens: R$ 38.000,00   [Usar sugestão]         |
|--------------------------------------------------------------|
|                                         [Cancelar]  [Salvar] |
+--------------------------------------------------------------+
```

### W9. Missing data on a move to Apresentação de Orçamento

```text
+--------------------------------------------------------------+
| Completar dados para enviar orçamento                    [X] |
|--------------------------------------------------------------|
| OPP-2001 · Tech Alpha Ltda → Apresentação de Orçamento       |
| Para avançar, a oportunidade precisa de valor estimado       |
| e de pelo menos um item de brinde.                           |
|                                                              |
| ITEM DE BRINDE *                                             |
| Brinde                    Qtd.     Valor un.                 |
| [Caneca personalizada ]  [300  ]  [R$ 15,00  ]               |
|                                                              |
| Valor estimado *                                             |
| [R$ 4.500,00         ]  Sugestão pelos itens                 |
|--------------------------------------------------------------|
|                                 [Cancelar]  [Salvar e mover] |
+--------------------------------------------------------------+
```

### W10. Marcar como perdida

Perdida uses the neutral `lost` tones, not error tones, including on the confirm button.

```text
+--------------------------------------------------------------+
| Marcar como perdida                                      [X] |
|--------------------------------------------------------------|
| OPP-2004 · Agência Pulso                                     |
| Perdida é um estado final: a oportunidade sai do funil.      |
|                                                              |
| Motivo *                                                     |
| ( ) Preço                                                    |
| ( ) Prazo de entrega                                         |
| (•) Escolheu concorrente                                     |
| ( ) Sem orçamento                                            |
| ( ) Sem resposta do cliente                                  |
| ( ) Outro                                                    |
|                                                              |
| Detalhe (obrigatório em "Outro")                             |
| [Fechou com fornecedor local, prazo menor.          ]        |
|--------------------------------------------------------------|
|                            [Cancelar]  [Marcar como perdida] |
+--------------------------------------------------------------+
```

### W11. Nova oportunidade

The "Responsável" field is locked for a salesperson. For a manager it is the select on the next line of the wireframe.

```text
+--------------------------------------------------------------+
| Nova oportunidade                                        [X] |
|--------------------------------------------------------------|
| Empresa *                                                    |
| [                                                    ]       |
| Contato *                                                    |
| [                                                    ]       |
| Responsável *                                                |
| [Ana (você)                                     (cadeado)]   |
| gestor: [Selecione um vendedor ▾]                            |
|--------------------------------------------------------------|
| OPCIONAL                                                     |
| Brinde                    Qtd.     Valor estimado            |
| [                     ]  [     ]  [R$           ]            |
|                                                              |
| (i) A oportunidade começa em Primeiro Contato.               |
|--------------------------------------------------------------|
|                             [Cancelar]  [Criar oportunidade] |
+--------------------------------------------------------------+
```

### W12. Marcar como retornado

```text
+--------------------------------------------------------------+
| Marcar como retornado                                    [X] |
|--------------------------------------------------------------|
| OPP-2004 · Agência Pulso · Follow-up                         |
| Todos os campos são opcionais.                               |
|                                                              |
| Como foi                                                     |
| [Ligação] [WhatsApp] [E-mail] [Reunião]                      |
|                                                              |
| Resumo                                                       |
| [                                                    ]       |
| [                                                    ]       |
|                                                              |
| Próxima data                                                 |
| [__/__/____]   até 30 dias                                   |
| (i) Sem data, o alerta volta em 6 dias (prazo de Follow-up). |
|--------------------------------------------------------------|
|                          [Cancelar]  [Marcar como retornado] |
+--------------------------------------------------------------+
```

### W13. Adiar

```text
+--------------------------------------------------------------+
| Adiar                                                    [X] |
|--------------------------------------------------------------|
| OPP-2004 · Agência Pulso                                     |
|                                                              |
| Adiar até *                                                  |
| [25/10/2026]   até 30 dias                                   |
|                                                              |
| Motivo                                                       |
| [Cliente pediu contato depois da feira.              ]       |
|                                                              |
| +----------------------------------------------------------+ |
| | (^) Este é o 2º adiamento seguido. A oportunidade será   | |
| |     escalonada para o gestor.                            | |
| +----------------------------------------------------------+ |
| (aviso aparece só no 2º adiamento seguido, tons escalated)   |
|--------------------------------------------------------------|
|                                          [Cancelar]  [Adiar] |
+--------------------------------------------------------------+
```

## Decisions

### 1. Routes

| Route | Screen |
|---|---|
| `/` | Redirects to `/oportunidades` |
| `/oportunidades` | Board. Search, filters, sort, "Ver todas", and the open panel (`op=`) live in the search params. |
| `/oportunidades/[code]` | Detail page |
| `/retornos`, `/time` | Placeholders until `add-follow-up-alerts` |

**Panel state:** the panel is a search param on the board, not a separate route.
- **Why:** a search param keeps the board's filters and scroll position, and the link can be shared.
- **Alternative considered:** intercepting and parallel routes, which would render the panel as a route over the board. Rejected: more moving parts for the same result, and the panel does not need its own loading boundary.

### 2. Data access behind one client

**Approach:**
- Screens read and write through a typed client in `lib/api/`. It speaks the REST contract the API will expose and sends the demo user in an `X-User-Id` header.
- Until the API exists, the client uses an in-repo mock with the case data, a fixed "today" of 15/10/2026, and the example deadlines.
- The mock filters by owner and rejects invalid moves, so the screens are exercised against the same rules.

**Alert computation:** the API computes alerts (decision 5). The mock reproduces only what the screens need to show: idle days, the share of the deadline used, snoozed, and escalated.

**Alternatives considered:**
- MSW. It adds a service worker and a dependency, and server components fetch outside the browser anyway.
- Next.js route handlers as the real API. Rejected: the API is a separate deliverable of the case, with its own tests.

### 3. Demo identity in a cookie

**Approach:** the selected user is stored in a cookie. Server components can then fetch as that user on the first render, with no client-side flash.

**Alternative considered:** `localStorage`. Rejected: the server cannot read it, so the first render would show the wrong data.

**Production:** the README explains that the cookie and the header are replaced by a token the API validates.

### 4. Drag and drop with `@dnd-kit`

**Why `@dnd-kit/core`:**
- It has pointer, touch, and keyboard sensors.
- It announces moves to screen readers.
- It lets the board dim forbidden columns while a card is dragged.

**Mobile:** drag is turned off below 768px, and "Mover para…" is the path instead.

**Alternatives considered:**
- Native HTML5 drag and drop: no touch or keyboard support.
- `react-beautiful-dnd`: deprecated.

**To check at implementation:** confirm the current version and React 19 support.

### 5. Optimistic move with rollback

**Approach:** a dropped card moves at once. If the API rejects the move, the card returns to its column and the API's message is shown. This follows the spec requirement "Rejected move".

**Forbidden columns:** the dimming during the drag comes from the rules the API publishes for the opportunity, so the interface never hard-codes them.

### 6. Board details settled during the interview

- **Alert count:** "com alerta" and "Precisam de atenção" count attention and escalated, not snoozed.
- **Lost opportunities:** with "Mostrar perdidas", they appear in the column of the stage they were lost from, with the lost badge. This is an assumption to confirm in the prototype review.
- **Event date on the card:** shown when the client event is 7 days away or less.
- **"Ver todas" in Fechamento:** expands the column to every closed opportunity, through a search param.
- **Long gift names:** truncated with an ellipsis on the card. The quantity always stays visible.

### 7. Claude Design handoff

Send these files:
- this `design.md`;
- `openspec/specs/design-system/spec.md`;
- the `@theme` block of `app/globals.css`.

Ask for a prototype of W1 to W13 that uses only those tokens.

**When the prototype comes back:**
- Visual adjustments go into `@theme` and the design-system spec.
- Layout or flow changes go into this change, through `/opsx:update`.
- Both happen before `/opsx:apply`.

## Risks / Trade-offs

- **[The board is too wide below 1280px]** → The board scrolls horizontally inside its own area. The top bar and toolbar stay fixed.
- **[The second click is hard to discover]** → "Abrir detalhes" is always in the panel. The second click is only a shortcut.
- **[The mock drifts from the real API]** → The client's types are the contract. When the API arrives, it is tested against the same scenarios.
- **[A salesperson marks a follow-up that did not happen]** → Accepted limitation, from the decision document. The date stays in the timeline.

## Open Questions

- **Stage returns (Q14):** which backward moves are allowed. Only the dimmed columns change, and the API publishes the rule.
- **Real deadline per stage.** The mock and the wireframes use example values.
- **Lead intake:** whether leads will also come in from the website.
