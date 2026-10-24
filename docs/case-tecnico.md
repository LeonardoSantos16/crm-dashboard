# CASE TÉCNICO — Desenvolvedor(a) Full Stack Pleno

---

## 01. O case

Você acaba de entrar no time de tecnologia do Grupo Nobre. Sua missão é criar a primeira versão de um CRM interno para o time comercial da Nobre Brindes: acompanhar oportunidades de venda, movê-las pelo funil e identificar negociações que precisam de atenção antes que a venda seja perdida. Para isso, responda a três perguntas por meio de uma solução funcional:

### 1. PRODUTO & UX | Como você torna a ferramenta clara e fácil de usar?

Crie uma interface com Next.js, React, TypeScript e Tailwind CSS para listar, pesquisar, filtrar e consultar oportunidades, além de movê-las de etapa. A visualização principal do funil deve ser um Kanban, com uma coluna por etapa e as oportunidades como cards que podem ser movidos entre colunas. Mostre claramente carregamento, erros, ausência de resultados e oportunidades que exigem atenção. O que avaliamos é se um vendedor encontra rápido a negociação que precisa trabalhar hoje. UX (experiência do usuário) significa ajudar a pessoa a encontrar a informação e realizar a tarefa com clareza, não apenas deixar a tela bonita.

### 2. ENGENHARIA | Como você garante regras corretas e dados consistentes?

Implemente uma API REST com Node.js e persistência em PostgreSQL. O funil tem cinco etapas, na ordem:

**Primeiro Contato → Apresentação de Orçamento → Follow-up → Forecast → Fechamento**

Uma oportunidade também pode ser marcada como **Perdida**. Fechamento e Perdida são estados finais. Nem toda mudança de etapa é válida. Algumas regras são dadas; as demais são suas para definir e justificar:

- Uma oportunidade só avança para Apresentação de Orçamento se tiver um valor estimado e pelo menos um item de brinde informado.
- Uma oportunidade só entra em Fechamento a partir de Forecast.
- Perdida pode ser aplicada a partir de qualquer etapa não final e exige um motivo de perda.
- Retornos de etapa: decida quais fazem sentido num processo comercial real (por exemplo, voltar de Follow-up para Apresentação de Orçamento quando o cliente pede revisão) e quais não fazem. Documente a sua decisão.

As regras devem ser validadas no backend, nunca apenas na tela. Registre o histórico de mudanças de etapa de cada oportunidade (quando, de onde, para onde). Não exponha credenciais e descreva como protegeria a API em produção; autenticação completa não é exigida.

### 3. AUTOMAÇÃO & QUALIDADE | Como você antecipa riscos e valida a solução?

Quatro problemas reais da nossa operação comercial:

1. O lead precisa ser atendido rápido. Como evitar que ele espere pelo primeiro contato e manter o SLA baixo?
2. Quanto mais o vendedor souber sobre a empresa do lead, melhor o atendimento e maior a chance de conversão. Como facilitar esse trabalho?
3. A ligação com o lead segue um roteiro para coletar informações do negócio. Como tornar essas informações acessíveis depois da ligação?
4. Com alto volume de atendimentos, é fácil esquecer de dar retorno a um lead. Como ajudar o vendedor a se organizar?

Escolha um desses problemas e implemente uma automação funcional integrada ao seu CRM, na stack que preferir dentro das que já usamos (Node.js/TypeScript ou Python), com testes para as regras críticas. Para os outros três, descreva no README como você resolveria e uma ideia de implementação. Use Git e documente execução, decisões, limitações e uso de IA (se houver).

---

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

*Campos em branco são intencionais: trate-os como parte do problema.*

---

## Entrega & o que avaliamos

Entregue o código, a estrutura/carga inicial do banco, a automação escolhida, os testes e um README com instruções de execução. Não precisa publicar em produção nem integrar um CRM real. Avaliaremos como você pensa, prioriza, estrutura, valida e explica as decisões, não a quantidade de funcionalidades ou de telas. Onde o enunciado deixa uma escolha aberta (retornos de etapa, qual problema automatizar, organização do código), queremos ver a sua decisão e o raciocínio por trás dela.
