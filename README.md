# NeuroXIQ - Setup local e pagamentos

## Requisitos

- Node.js 20+
- npm 10+
- Projeto Supabase configurado (mesmo projeto usado em produção)
- Stripe configurado (chaves e webhook)

## Rodar o frontend local

1. Instale dependências:

```sh
npm install
```

2. Crie/ajuste o `.env`:

```env
VITE_SUPABASE_URL="https://SEU_PROJETO.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="SUA_ANON_KEY"
VITE_SUPABASE_PROJECT_ID="SEU_PROJECT_ID"
```

3. Inicie o app:

```sh
npm run dev
```

4. Abra no navegador:

```text
http://localhost:5173
```

## Rodar funções Supabase localmente (opcional, recomendado para debug)

```sh
supabase start
supabase functions serve --env-file ./supabase/.env.local
```

Exemplo de `supabase/.env.local` para funções:

```env
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

STRIPE_SECRET_KEY="sk_test_... ou sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
APP_URL="http://localhost:5173"
```

## Variáveis críticas para checkout no domínio próprio

No ambiente das Edge Functions (produção), valide:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `APP_URL` (ex: `https://www.seudominio.com.br`)

Sem `APP_URL` correto, os redirecionamentos de retorno/cancelamento podem ir para domínio errado.

## Comandos úteis

- `npm run dev` -> desenvolvimento
- `npm run build` -> build produção
- `npm run preview` -> validar build local
- `npm run lint` -> checagem de lint
- `npm run test` -> testes com Vitest
