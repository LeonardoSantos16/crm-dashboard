# Design

## Context

- **Builds on `add-opportunity-funnel`:**
  - the app shell, with the Retornos and Time tabs as placeholders and the bell as an empty slot;
  - the opportunity side panel;
  - the "Marcar como retornado" and "Adiar" dialogs;
  - the data client with its in-repo mock.

  This change fills those slots in and reuses the rest unchanged.
- **Alerts:** the API computes them (decision 5). An hourly worker only sends notifications, so the lists stay correct even if the worker stops.
- **Interview:** the screen decisions below come from the same design interview (2026-10-23). See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Wireframes that Claude Design can prototype together with the funnel's, sharing the same shell and patterns.
- A Retornos list that answers "what do I follow up on today" in one place, across stages.

**Non-Goals:**
- The e-mail channel and the worker itself.
- Any manager action beyond viewing, the inline follow-up actions, and commenting. Reassigning an opportunity is out of scope.

## Wireframes

The conventions, legend, sample data, and example deadlines are the same as in `add-opportunity-funnel/design.md` (section "How to read them"). Two more marks:

| Mark | Meaning |
|---|---|
| `[sino•]` | Bell with the unread dot |
| `_1_` | A number that is a link |
| `(v)` | Success (`circle-check`, success tones) |

OPP-2010 to OPP-2013 are illustrative opportunities added so that Ana's list shows every section. They are not in the case data, and the mock should include them.

### R1. Retornos (salesperson)

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| ♛ Nobre CRM         Oportunidades   Retornos                  [+ Nova oportunidade]   [sino•]   Entrando como: Ana (vendedora) ▾ |
|                                     ‾‾‾‾‾‾‾‾                                                                   MODO DEMONSTRAÇÃO |
+----------------------------------------------------------------------------------------------------------------------------------+
+----------------------------------------------------------------------------------------------------------------------------------+
| RETORNOS                                                                                                                         |
| [Buscar por código ou empresa   ]   Situação: (Atrasada) (Escalonada) (Adiada)   Etapa: [Todas ▾]   Ordenar: [Prioridade ▾]      |
|----------------------------------------------------------------------------------------------------------------------------------|
| ATRASADAS · 2                                                                                                                    |
|                                                                                                                                  |
| (!) Atenção    OPP-2010 · Farmácia Bem Estar  Primeiro Contato  Parada há 3 dias · prazo 1 dia    R$ 2.100   [Retornado] [Adiar] |
| (^) Escalonada OPP-2011 · Hotel Mar Azul      Follow-up         Sem retorno após alerta · 13 dias R$ 12.300  [Retornado] [Adiar] |
|----------------------------------------------------------------------------------------------------------------------------------|
| VENCEM EM ATÉ 2 DIAS · 2                                                                                                         |
|                                                                                                                                  |
|                OPP-2001 · Tech Alpha Ltda     Primeiro Contato  Vence hoje                        R$ 4.500   [Retornado] [Adiar] |
|                OPP-2012 · Studio Forma        Forecast          Vence em 2 dias · 17/10           R$ 6.800   [Retornado] [Adiar] |
|----------------------------------------------------------------------------------------------------------------------------------|
| ▸ ADIADAS · 1                                                                              (recolhida; abre com clique ou Enter) |
+----------------------------------------------------------------------------------------------------------------------------------+
(dados ilustrativos: OPP-2010 a OPP-2013 não estão no case)
```

**Adiadas expanded**

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| ▾ ADIADAS · 1                                                                                                                    |
|                                                                                                                                  |
| (z) Adiada     OPP-2013 · Padaria Central     Follow-up         Até 20/10 · "Dono viajando"       R$ 1.900                       |
+----------------------------------------------------------------------------------------------------------------------------------+
```

### R2. Retornos with nothing overdue

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| ATRASADAS · 0                                                                                                                    |
|                                                                                                                                  |
|                                     (v) Nenhum retorno pendente. Tudo em dia.                                                    |
|                                                                                                                                  |
|----------------------------------------------------------------------------------------------------------------------------------|
| VENCEM EM ATÉ 2 DIAS · 1                                                                                                         |
|                                                                                                                                  |
|                OPP-2001 · Tech Alpha Ltda     Primeiro Contato  Vence amanhã                      R$ 4.500   [Retornado] [Adiar] |
+----------------------------------------------------------------------------------------------------------------------------------+
```

### R3. Retornos (manager)

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| ♛ Nobre CRM         Oportunidades   Retornos   Time           [+ Nova oportunidade]   [sino•]   Entrando como: Marcos (gestor) ▾ |
|                                     ‾‾‾‾‾‾‾‾                                                                   MODO DEMONSTRAÇÃO |
+----------------------------------------------------------------------------------------------------------------------------------+
+----------------------------------------------------------------------------------------------------------------------------------+
| ESCALONADAS DO TIME · 1                                                                                                          |
| [Buscar por código ou empresa         ]   Etapa: [Todas ▾]   Vendedor: [Todos ▾]   Ordenar por: [Prioridade ▾]                   |
|----------------------------------------------------------------------------------------------------------------------------------|
| (^) Escalonada OPP-2004 · Agência Pulso   Carla   Follow-up   Sem retorno após o alerta   R$ 3.900  [Retornado] [Adiar]          |
|                                                                                                                                  |
| (gestor vê só escalonadas; atrasadas e adiadas ele acompanha pela aba Time)                                                      |
+----------------------------------------------------------------------------------------------------------------------------------+
```

### R4. Retornos loading and error

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| ATRASADAS                                                                                                                        |
| ▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒                                                     |
| ▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒                                                     |
| ▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒                                                     |
| aria-busy="true" · leitor de tela: "Carregando retornos"                                                                         |
+----------------------------------------------------------------------------------------------------------------------------------+
```

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| (!) Não foi possível carregar os retornos.   [Tentar novamente]                                                                  |
| role="alert" · tons de erro                                                                                                      |
+----------------------------------------------------------------------------------------------------------------------------------+
```

### R5. Retornos on mobile

The filter sheet follows the same pattern as the board's (W4 in the funnel change), with the situation, stage, and sort controls of this screen.

```text
+----------------------------------------+
| ♛ Nobre CRM          [+]  [sino•]  [≡] |
|----------------------------------------|
| [Buscar código ou empresa] [Filtros·0] |
|----------------------------------------|
| ATRASADAS · 2                          |
| +------------------------------------+ |
| | (!) Atenção               R$ 2.100 | |
| | OPP-2010 · Farmácia Bem Estar      | |
| | Primeiro Contato                   | |
| | Parada há 3 dias · prazo 1 dia     | |
| | [ Retornado ]       [ Adiar ]      | |
| +------------------------------------+ |
| +------------------------------------+ |
| | (^) Escalonada           R$ 12.300 | |
| | OPP-2011 · Hotel Mar Azul          | |
| | Follow-up                          | |
| | Sem retorno após alerta · 13 dias  | |
| | [ Retornado ]       [ Adiar ]      | |
| +------------------------------------+ |
| VENCEM EM ATÉ 2 DIAS · 2               |
| …                                      |
|----------------------------------------|
| ▦ Oportunidades   ↩ Retornos           |
|                   ‾‾‾‾‾‾‾‾‾‾           |
+----------------------------------------+
```

### T1. Time (manager)

```text
+----------------------------------------------------------------------------------------------------------------------------------+
| ♛ Nobre CRM         Oportunidades   Retornos   Time           [+ Nova oportunidade]   [sino•]   Entrando como: Marcos (gestor) ▾ |
|                                                ‾‾‾‾                                                            MODO DEMONSTRAÇÃO |
+----------------------------------------------------------------------------------------------------------------------------------+
+----------------------------------------------------------------------------------------------------------------------------------+
| TIME · RETORNOS POR VENDEDOR                                                                                                     |
| Ordenado por escalonadas. Números sublinhados abrem Retornos filtrado.                                                           |
|----------------------------------------------------------------------------------------------------------------------------------|
| VENDEDOR                       ATIVAS       ATRASADAS      ESCALONADAS      ADIADAS                                              |
|----------------------------------------------------------------------------------------------------------------------------------|
| Carla                          1            0              (^) _1_          0                                                    |
| Bruno                          2            _1_            0                (z) _1_                                              |
| Ana                            2            0              0                0                                                    |
|----------------------------------------------------------------------------------------------------------------------------------|
| TOTAL DO TIME                  5            1              1                1                                                    |
|                                                                                                                                  |
| (contagens a partir dos dados do case; 0 é texto, não link)                                                                      |
+----------------------------------------------------------------------------------------------------------------------------------+
```

### T2. Time on mobile

```text
+----------------------------------------+
| TIME                                   |
| +------------------------------------+ |
| | Carla                              | |
| | ATIVAS        1                    | |
| | ATRASADAS     0                    | |
| | ESCALONADAS   (^) _1_              | |
| | ADIADAS       0                    | |
| +------------------------------------+ |
| +------------------------------------+ |
| | Bruno                              | |
| | ATIVAS        2                    | |
| | ATRASADAS     _1_                  | |
| | ESCALONADAS   0                    | |
| | ADIADAS       (z) _1_              | |
| +------------------------------------+ |
| …                                      |
+----------------------------------------+
```

### N1. Notifications

The menu opens below the bell as a popover on desktop, and as a full-screen sheet on mobile.

```text
+--------------------------------------+  +----------------------------------------------------------+
|                              [sino•] |  | NOTIFICAÇÕES (Ana)             [Marcar todas como lidas] |
|                                    ↑ |  |----------------------------------------------------------|
| ponto = há não lidas (sem número)    |  | (!) OPP-2011 · Hotel Mar Azul está parada há 6 dias      |
| nome acessível: "Notificações.       |  |     há 20 min                                 • Não lida |
| Há notificações novas"               |  |----------------------------------------------------------|
| tooltip: "Há notificações novas"     |  | (!) OPP-2010 · Farmácia Bem Estar está parada há 2 dias  |
+--------------------------------------+  |     há 2 h                                    • Não lida |
                                          |----------------------------------------------------------|
                                          | (z) Adiamento de OPP-2012 · Studio Forma terminou        |
                                          |     ontem, 09:00                                         |
                                          |----------------------------------------------------------|
                                          | GESTOR RECEBE SÓ ESCALONAMENTOS, POR EXEMPLO:            |
                                          | (^) OPP-2004 · Agência Pulso foi escalonada · Carla      |
                                          +----------------------------------------------------------+
```

**Empty menu**

```text
+----------------------------------------------------------+
| NOTIFICAÇÕES                                             |
|----------------------------------------------------------|
|                                                          |
| Nenhuma notificação.                                     |
|                                                          |
+----------------------------------------------------------+
```

## Decisions

### 1. What counts where

| | Retornos (salesperson) | Time column | "Precisam de atenção" (board) |
|---|---|---|---|
| Attention | Atrasadas | Atrasadas | counted |
| Escalated | Atrasadas | Escalonadas | counted |
| Snoozed | Adiadas | Adiadas | not counted |
| Due in ≤ 2 days, no alert | Vencem em até 2 dias | not shown | not counted |

- **Retornos:** escalated opportunities sit in Atrasadas, because for the salesperson they are still overdue work.
- **Time:** the columns do not overlap, so the total row never counts an opportunity twice. Escalated opportunities appear only under Escalonadas.

### 2. "Due" date for the second section

**Definition:** the due date is the alert clock's start plus the stage deadline. The clock starts at the latest of three events: entering the stage, the last follow-up, or the end of a snooze (decision 16). When the salesperson chose a next date, that date is the due date.

**Responsibility:** the API returns the due date with each opportunity, and the screen only groups rows by it.

**Why 2 days:** today plus the next 2 days covers the work a salesperson can plan for. Agreed in the interview.

### 3. Routes and URL state

**Routes:**
- `/retornos` keeps its search, filters, sort, and the open panel (`op=`) in the search params, like the board.
- Links from Time point to `/retornos?vendedor=<id>&situacao=<state>`.
- `/time` sends a salesperson to `/oportunidades`.

**Enforcement:** the API is what blocks team data; the redirect is only for usability.

### 4. Notifications are read through the API

**Approach:**
- The bell reads `GET /notifications` and marks items read through the API, so read state is shared across devices.
- The bell refreshes when the window regains focus and every few minutes. No websocket.

**Why:** alerts move in days and the worker runs hourly, so real-time delivery adds nothing.

**Alternative considered:** a websocket or server-sent events. Rejected: more infrastructure for no visible gain at this time scale.

### 5. Dot without a count

**Decision:** the bell shows only a dot when there are unread notifications. Agreed in the interview: it signals that something is new without the pressure of a growing number.

**Accessibility:** the unread state is in the bell's accessible name and in a tooltip, so it is never conveyed by color alone. Inside the menu, each unread item says "Não lida".

### 6. Inline actions reuse the funnel dialogs

**Approach:** "Retornado" and "Adiar" on a row open the same dialogs as the panel. After a confirmed action, the list refetches, and the row moves to its new section or leaves the list.

**Accepted cost:** an extra request per action. In return, there is no client-side recomputation of sections that could drift from the API.

### 7. Assumptions made while writing (to confirm in the prototype review)

- **Total row:** Time ends with a team total row.
- **Salesperson on `/time`:** sent to Oportunidades rather than shown a 404.
- **Adiadas rows:** they have no inline actions. Clicking the row opens the panel, which can still mark as followed up.

## Risks / Trade-offs

- **[A manager ignores Time, and escalations pile up]** → Escalations also reach the manager as notifications and in Retornos ("Escalonadas do time").
- **[The bell's dot is easy to miss]** → Accepted in the interview. Retornos remains the main path, and the bell is only a shortcut.
- **[The "Vencem em até 2 dias" section grows large for a busy salesperson]** → It is ordered by due date, and its count is in the header. A future change could make it collapsible.

## Open Questions

- **Real stage deadlines:** they change only the numbers shown, not the screens.
- **Notification retention:** how long notifications stay in the menu. This does not affect the wireframes.
