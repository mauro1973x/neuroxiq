
# Plano: Corrigir Fluxo de Pagamento Travando

## Problema Identificado

O fluxo de pagamento trava porque:

1. **Checkout abre em nova aba** - O pagamento é concluído na nova aba, mas a aba original não recebe a atualização
2. **Webhook com erro de assinatura** - O secret `STRIPE_WEBHOOK_SECRET` pode estar incorreto ou desatualizado
3. **Polling não sincroniza entre abas** - A aba original não detecta o pagamento feito na outra aba

## Solução Proposta

### 1. Alterar para Checkout na Mesma Aba

Modificar `UnlockPremiumButton.tsx` e `PremiumPaywall.tsx` para usar `window.location.href` em vez de `window.open`, garantindo que:
- O usuário seja redirecionado para o Stripe Checkout na mesma aba
- Após o pagamento, volte diretamente para `/resultado/:attemptId` com os parâmetros de verificação
- Evita problemas de bloqueio de pop-up no mobile

```text
Antes:  window.open(data.url, '_blank')
Depois: window.location.href = data.url
```

### 2. Melhorar Detecção de Retorno do Pagamento

Modificar `Resultado.tsx` para:
- Detectar os parâmetros `payment=success` e `session_id` na URL
- Chamar imediatamente a função `verify-session` para verificar e liberar o acesso
- Iniciar o polling como fallback enquanto aguarda confirmação do webhook

### 3. Corrigir Verificação via `verify-session`

Quando o usuário retorna do Stripe com `session_id`:
1. Chamar automaticamente a edge function `verify-session`
2. Se o pagamento estiver confirmado, atualizar `has_premium_access = true`
3. Recarregar os dados da tentativa e exibir o relatório premium

### 4. Adicionar Fallback para Webhook

O webhook do Stripe ainda apresenta erros de assinatura. Para garantir robustez:
- A função `verify-session` já funciona como verificação secundária
- Quando chamada, consulta o Stripe diretamente e atualiza o banco
- Isso garante que mesmo sem o webhook, o acesso seja liberado

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/components/quiz/UnlockPremiumButton.tsx` | Usar `location.href` em vez de `window.open` |
| `src/components/quiz/PremiumPaywall.tsx` | Usar `location.href` em vez de `window.open` |
| `src/pages/Resultado.tsx` | Chamar `verify-session` ao detectar retorno do pagamento |

## Fluxo Corrigido

```text
1. Usuário clica "Desbloquear"
         |
         v
2. location.href → Stripe Checkout (mesma aba)
         |
         v
3. Usuário paga no Stripe
         |
         v
4. Stripe redireciona → /resultado/:attemptId?payment=success&session_id=xxx
         |
         v
5. Página detecta parâmetros → chama verify-session
         |
         v
6. verify-session confirma pagamento → atualiza has_premium_access=true
         |
         v
7. Página recarrega dados → exibe relatório premium
```

## Seção Tecnica

### Mudanca no UnlockPremiumButton

```typescript
// Antes
if (data?.url) {
  onPaymentInitiated?.();
  window.open(data.url, '_blank');
}

// Depois
if (data?.url) {
  onPaymentInitiated?.();
  window.location.href = data.url;
}
```

### Mudanca no Resultado.tsx

Adicionar um `useEffect` que detecta o retorno do pagamento e chama a verificacao:

```typescript
useEffect(() => {
  const verifyPaymentOnReturn = async () => {
    if (paymentParam === 'success' && sessionId && user && !attempt?.has_premium_access) {
      try {
        const { data, error } = await supabase.functions.invoke('verify-session', {
          body: { sessionId }
        });
        
        if (data?.verified) {
          toast({ title: 'Pagamento Confirmado!', ... });
          fetchAttempt(); // Recarrega os dados
        }
      } catch (err) {
        console.error('Verification error:', err);
      }
    }
  };
  
  verifyPaymentOnReturn();
}, [paymentParam, sessionId, user, attempt?.has_premium_access]);
```

## Resultado Esperado

Apos as correcoes:
- O checkout abre na mesma aba (sem bloqueio de pop-up)
- Apos o pagamento, o usuario retorna para a pagina de resultado
- A pagina verifica o pagamento automaticamente via `verify-session`
- O relatorio premium e exibido imediatamente
- Nao ha mais tela de "Aguardando Confirmacao" travada
