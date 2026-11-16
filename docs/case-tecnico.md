# Case técnico: resumo do problema

Resumo, com minhas palavras, do case técnico que deu origem a este projeto.

## Contexto

Um time comercial de uma empresa de brindes personalizados precisa da primeira versão de um CRM interno para acompanhar oportunidades de venda, movê-las pelo funil e identificar as negociações que precisam de atenção antes que a venda seja perdida.

## Produto e UX

- Interface em Next.js, React, TypeScript e Tailwind CSS para listar, buscar, filtrar e consultar oportunidades, e para movê-las de etapa.
- O funil é um Kanban: uma coluna por etapa e um card por oportunidade.
- Carregamento, erros, ausência de resultados e oportunidades que exigem atenção precisam estar claros.
- O critério é se o vendedor encontra rápido a negociação que precisa trabalhar hoje.

## Engenharia

API REST em Node.js com PostgreSQL. O funil tem cinco etapas, nesta ordem:

**Primeiro Contato → Apresentação de Orçamento → Follow-up → Forecast → Fechamento**

Uma oportunidade também pode ser marcada como **Perdida**. Fechamento e Perdida são estados finais. Regras dadas:

- Entrar em Apresentação de Orçamento exige valor estimado e pelo menos um item de brinde.
- Fechamento só a partir de Forecast.
- Perdida vale a partir de qualquer etapa não final e exige um motivo.
- Quais retornos de etapa são permitidos fica a meu critério, com a decisão documentada.

As regras são validadas no backend, e cada mudança de etapa fica registrada no histórico (quando, de onde, para onde).

## Automação

Escolher um de quatro problemas comerciais e implementar uma automação integrada ao CRM, com testes das regras críticas:

1. Reduzir o tempo de espera do lead pelo primeiro contato.
2. Facilitar a pesquisa sobre a empresa do lead.
3. Tornar acessíveis as informações coletadas na ligação.
4. Ajudar o vendedor a não esquecer de dar retorno ao lead.

Escolhi o problema 4. A descrição está no [README](../README.md#automação-alerta-de-retorno-problema-4).

## Dados fictícios

**Data de referência:** 15/10/2026

| Código | Empresa | Brinde | Qtd. | Valor est. (R$) | Vendedor | Último contato | Validade proposta | Evento do cliente | Etapa |
|---|---|---|---|---|---|---|---|---|---|
| OPP-2001 | Tech Alpha Ltda | Caneca personalizada | 300 | 4.500 | Ana | 14/10/2026 | | 30/11/2026 | Primeiro Contato |
| OPP-2002 | Construtora Horizonte | Kit escritório | 120 | 9.800 | Bruno | 06/10/2026 | 13/10/2026 | 25/10/2026 | Apresentação de Orçamento |
| OPP-2003 | Clínica Vida | Squeeze personalizado | 500 | 7.200 | Ana | 13/10/2026 | 20/10/2026 | 18/10/2026 | Follow-up |
| OPP-2004 | Agência Pulso | Camiseta estampada | 80 | 3.900 | Carla | 02/10/2026 | 10/10/2026 | 05/11/2026 | Follow-up |
| OPP-2005 | Banco Norte | Agenda executiva | 1.000 | 38.000 | Bruno | 15/10/2026 | 22/10/2026 | 12/12/2026 | Forecast |
| OPP-2006 | Escola Saber | Mochila infantil | 250 | 11.500 | Carla | 09/10/2026 | 16/10/2026 | 17/10/2026 | Fechamento |
| OPP-2007 | Padaria do Bairro | Caneta promocional | 50 | 350 | Ana | 01/10/2026 | 08/10/2026 | 20/10/2026 | Perdida |

Os campos em branco são intencionais e fazem parte do problema.
