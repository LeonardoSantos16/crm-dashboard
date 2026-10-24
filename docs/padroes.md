# Padrões do projeto

Padrões de código do `crm-dashboard`. Partem dos padrões do BookWise, adaptados para a stack deste projeto: Next.js 16 com App Router e `cacheComponents`, React 19, Tailwind CSS 4 com tokens, TanStack Query v5 e a `crm-api` como backend.

Este documento cobre a organização do código. As regras visuais (tokens, cores, estados, pt-BR, só tema claro) estão no `CLAUDE.md` e em `openspec/specs/design-system/spec.md`.

---

## 1. Estrutura de pastas

```
src/
├── app/                     # rotas (App Router)
│   ├── layout.tsx
│   ├── providers.tsx        # QueryClientProvider + CurrentUserProvider (client)
│   ├── globals.css          # @theme com os tokens
│   └── oportunidades/
│       ├── page.tsx
│       ├── _components/     # componentes usados só por esta rota
│       └── [id]/page.tsx
├── components/              # componentes usados por duas ou mais rotas
│   ├── feedback/            # StatusBadge, Skeleton, ErrorState, EmptyState, Toast
│   └── form/                # MoneyInput e outros campos
├── hooks/                   # hooks customizados (useXxx.ts)
│   └── opportunities/       # um hook por consulta ou ação da API
└── lib/                     # clientes e helpers de infraestrutura
    ├── axios.ts             # instância `api`
    ├── react-query.ts       # instância `queryClient`
    ├── dates.ts             # contas de data relativas ao X-Today
    └── api/
        ├── types.ts         # contrato da crm-api (cópia de docs/integracao-api)
        └── errors.ts        # códigos da API → texto em pt-BR
tests/                       # testes de design system
docs/                        # case, contrato da API e estes padrões
openspec/                    # specs e changes
public/                      # estáticos
```

- O alias `@/*` aponta para `./src/*`: `import { api } from "@/lib/axios"`.
- Não existe `src/pages/`. Uma pasta com esse nome ao lado de `src/app` ativa o Pages Router.
- `public/`, `.env*` e os arquivos de configuração ficam na raiz.

**Onde colocar um componente:**

- usado por **uma** rota → `src/app/<rota>/_components/`. O `_` torna a pasta privada: o Next não a trata como rota;
- usado por **duas ou mais** → `src/components/`.

---

## 2. Componentes

### Um arquivo por componente

O componente fica em `NomeComponente.tsx`, com export nomeado. Os estilos são classes do Tailwind no próprio JSX, sem `styles.ts`.

```tsx
// src/components/feedback/StatusBadge.tsx
export function StatusBadge({ state, label }: StatusBadgeProps) { /* ... */ }
```

Se um componente crescer e ganhar partes privadas, vira uma pasta com `index.tsx` e os arquivos auxiliares ao lado.

### Server e client components

- `page.tsx` e `layout.tsx` são server components e funcionam como casca: montam a estrutura e renderizam os componentes interativos.
- Componentes que usam estado, efeitos, hooks do TanStack Query ou eventos levam `"use client"` no topo.
- Coloque o `"use client"` o mais fundo possível na árvore, não na página inteira.
- Um componente que usa `useSearchParams` fica dentro de um `<Suspense>`, com fallback, porque o `cacheComponents` exige.

```tsx
// src/app/oportunidades/page.tsx
export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<BoardSkeleton />}>
      <Board />
    </Suspense>
  );
}
```

### Lógica compartilhada → hook

Quando dois componentes usam a mesma lógica, ela vai para `src/hooks/`. Exemplo: `useCurrentUser` dá o usuário de demonstração para a barra superior, para o formulário de nova oportunidade e para as `queryKey`.

### Lógica sem React → função pura em `lib/`

Contas que não dependem de React (agrupar cards por etapa, calcular "Vencida há N dias", traduzir um erro) ficam em `src/lib/` como funções puras. Elas recebem tudo por argumento, inclusive o "hoje".

---

## 3. Layout e providers

`src/app/providers.tsx` é um client component que monta os providers nesta ordem:

```tsx
"use client";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>{children}</CurrentUserProvider>
    </QueryClientProvider>
  );
}
```

- O `layout.tsx` raiz renderiza `<Providers>` em volta de `children`.
- O `queryClient` fica em `src/lib/react-query.ts`, nunca criado dentro de um componente.
- A identidade de demonstração fica no `localStorage`, lido e gravado dentro de try/catch. Sem usuário salvo, vale o primeiro `SELLER` de `/api/users`.

---

## 4. Dados no cliente

### Acesso à API

O navegador chama `/api/...` no próprio Next, e um rewrite em `next.config.ts` repassa a chamada para a `crm-api`. Assim não há CORS.

```ts
// next.config.ts
async rewrites() {
  return [{ source: "/api/:path*", destination: `${process.env.API_URL}/api/:path*` }];
}
```

### Cliente HTTP

```ts
// src/lib/axios.ts
export const api = axios.create({ baseURL: "/api" });
```

- Sempre usar `api`, sem misturar com `fetch`.
- Um interceptor de requisição põe o header `X-User-Id` com o usuário atual.
- Um interceptor de resposta guarda o header `X-Today`. O "hoje" do front é sempre esse valor, nunca a data do navegador. Leia com `useToday()`.

### Tipos

`src/lib/api/types.ts` é a fonte da verdade do contrato. É uma cópia de `docs/integracao-api/crm-api-front-types.ts`; quando a API mudar, compare os dois arquivos. Não declare tipos de resposta da API em outro lugar.

### Busca com TanStack Query v5

Cada consulta tem um hook em `src/hooks/`. A `queryKey` é um array com **todos** os parâmetros da busca, inclusive o usuário atual. O componente usa o `data` retornado, sem copiá-lo para `useState`.

```ts
export function useOpportunities(filters: ListQuery) {
  const { user } = useCurrentUser();
  return useQuery({
    queryKey: ["opportunities", user?.id, filters],
    queryFn: async () => {
      const response = await api.get<OpportunityList>("/opportunities", { params: filters });
      return response.data;
    },
    enabled: !!user,
  });
}
```

- Os parâmetros vão em `params`, nunca concatenados na URL.
- Uma busca que depende de algo que pode ainda não existir usa `enabled`.
- Trate sempre `isPending` e `isError` na UI, com os componentes de `components/feedback/`.

### Ações com `useMutation`

Toda ação da `crm-api` devolve o detalhe atualizado. Depois do sucesso:

- `setQueryData` no detalhe, sem buscá-lo de novo;
- `invalidateQueries` na lista, o que também atualiza o contador `needsAttention`.

```ts
onSuccess: (detail) => {
  queryClient.setQueryData(["opportunity", user?.id, detail.id], detail);
  queryClient.invalidateQueries({ queryKey: ["opportunities"] });
},
```

Não use flags como `newPost` para forçar atualização.

Só o movimento de etapa é otimista: `onMutate` move o card no cache, e `onError` desfaz e mostra a mensagem.

### Estado na URL

Busca, filtros, ordenação e o painel aberto (`op`) ficam nos search params:

- os nomes são os mesmos da API, para que o objeto vá direto em `params`;
- as mudanças usam `router.replace`, para não empilhar histórico.

### Erros

A `message` da API é em inglês e serve só para log. O texto exibido sai de `src/lib/api/errors.ts`:

- `getErrorMessage(error)`: texto em pt-BR a partir do `code` e do `details.reason`;
- `applyValidationErrors(error, setError)`: leva cada `details[].path` de um `VALIDATION_ERROR` para o campo do formulário.

---

## 5. Formulários

A stack é **React Hook Form + Zod**.

```tsx
const snoozeSchema = z.object({
  until: z.string().min(1, "Escolha até quando adiar"),
  reason: z.string().max(500, "Use até 500 caracteres").optional(),
});

type SnoozeData = z.infer<typeof snoozeSchema>;

const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
  useForm<SnoozeData>({ resolver: zodResolver(snoozeSchema) });
```

- O schema fica no topo do arquivo do formulário, e o tipo vem de `z.infer`.
- As mensagens de erro ficam em pt-BR, no próprio schema.
- O schema repete as regras da API (obrigatórios, tamanhos, e-mail, positivos, janela de datas), para o usuário ver o erro antes de enviar.
- Erros que só o servidor detecta chegam pelo `applyValidationErrors`.
- Valores em reais usam `MoneyInput`, que mostra "R$ 1.234,56" e entrega `number`.
- O botão de envio fica desabilitado com `isSubmitting`.
- Diálogos e menus usam Radix (`@radix-ui/react-dialog` e `@radix-ui/react-dropdown-menu`), estilizados com os tokens.

---

## 6. Imagens e ícones

- Imagens sempre com `next/image`, com `width` e `height`; `priority` na imagem principal acima da dobra. Estáticos ficam em `public/`.
- `alt` descritivo, em pt-BR.
- Ícones do `lucide-react`, com tamanho por classe (`size-4`) e cor herdada do texto (`currentColor`), nunca uma cor fixa.
- Ícone decorativo ao lado de um texto leva `aria-hidden="true"`.

---

## 7. Acessibilidade

- Botões só com ícone têm `aria-label` (ex.: `aria-label="Fechar"`).
- Todo `<button>` declara `type` (`"button"` ou `"submit"`).
- Estados de `hover` vêm acompanhados de `focus-visible`.
- Nenhum estado é passado só por cor: sempre ícone e texto (`StatusBadge`).
- Regiões carregando usam `aria-busy`; erros usam `role="alert"`; avisos usam `role="status"`.

---

## 8. Nomenclatura

| Item | Padrão | Exemplo |
|---|---|---|
| Componente e arquivo | PascalCase | `OpportunityCard.tsx` |
| Pasta de rota | segmento da URL, em pt-BR | `oportunidades/`, `[id]/` |
| Pasta privada de rota | `_` + camelCase | `_components/` |
| Hook | `useXxx` em camelCase | `useBoardFilters.ts` |
| Função ou helper | camelCase | `groupByStage`, `getErrorMessage` |
| Handler de evento | `handleXxx` | `handleClearSearch` |
| Prop de callback | `onXxx` | `onClose`, `onMove` |
| Booleanos | `isXxx` / `hasXxx` | `isPanelOpen`, `hasAlert` |
| Props | camelCase | `estimatedValue`, `ownerId` |
| Constantes | UPPER_SNAKE_CASE | `STAGES`, `USER_HEADER` |

Identificadores, arquivos e tokens CSS ficam em inglês. Texto de interface fica em pt-BR. As rotas são a exceção: são texto que o usuário vê na URL, por isso ficam em pt-BR.

---

## 9. Fluxo de trabalho

- Uma feature começa como uma change do OpenSpec (`/opsx:propose`), com proposal, design, specs e tasks, antes de qualquer código.
- Cada fatia de uma change vira uma branch a partir da `develop` e um PR para a `develop`. O CI roda lint, typecheck, test e build.
- Variáveis de ambiente ficam documentadas no `.env.example` (ex.: `API_URL`).
- Antes de usar uma API do Next, leia o guia correspondente em `node_modules/next/dist/docs/`, porque esta versão tem mudanças incompatíveis com as anteriores.
