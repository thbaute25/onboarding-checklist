# ⚙️ Como Configurar a URL do Webhook no WebPart

## 📋 Pré-requisitos

1. ✅ Flow criado no Power Automate
2. ✅ URL do webhook copiada do Flow
3. ✅ WebPart publicado no SharePoint

---

## 🎯 Método 1: Via Interface do SharePoint (Recomendado)

### Passo 1: Acessar a Página do SharePoint

1. Vá para a página onde o WebPart está adicionado
2. Clique no ícone de **edição** (lápis) no canto superior direito
3. Ou clique em **"Editar"** no menu da página

### Passo 2: Abrir Propriedades do WebPart

1. Passe o mouse sobre o WebPart **"Home Onboarding"**
2. Clique no ícone de **engrenagem** ⚙️ ou **"Editar WebPart"**
3. O painel de propriedades abrirá à direita

### Passo 3: Configurar URL do Webhook

1. No painel de propriedades, role até a seção:
   ```
   Power Automate - Notificações Teams
   ```

2. No campo **"URL do Webhook - Notificações Teams"**:
   - Cole a URL do webhook que você copiou do Power Automate
   - Exemplo de URL:
     ```
     https://prod-xx.westus.logic.azure.com:443/workflows/xxx/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xxx
     ```

3. Clique em **"Aplicar"** ou **"OK"** no painel de propriedades

4. Clique em **"Publicar"** ou **"Salvar"** na página

### Passo 4: Testar

1. Saia do modo de edição
2. Envie uma dúvida pelo chat
3. Verifique se a notificação chegou no Teams para `thenriquebaute@alvarezandmarsal.com`

---

## 💻 Método 2: Via Código (Desenvolvimento)

Se preferir configurar diretamente no código:

### Editar `HomeOnboardingWebPart.ts`

1. Abra o arquivo: `src/webparts/homeOnboarding/HomeOnboardingWebPart.ts`

2. Localize a interface `IHomeOnboardingWebPartProps` e adicione um valor padrão:

```typescript
export interface IHomeOnboardingWebPartProps {
  description: string;
  chatWebhookUrl?: string;
}

// Adicionar valor padrão (opcional)
private _defaultChatWebhookUrl = 'COLE_AQUI_A_URL_DO_WEBHOOK';
```

3. Ou configure diretamente no `render()`:

```typescript
case 'duvidas': {
  const powerAutomateConfig: IPowerAutomateConfig = {
    chatWebhookUrl: 'COLE_AQUI_A_URL_DO_WEBHOOK' || this.properties.chatWebhookUrl,
    progressoWebhookUrl: undefined
  };
  // ... resto do código
}
```

4. Execute `gulp build` e `gulp serve`

---

## 📝 Onde Obter a URL do Webhook

### No Power Automate:

1. Acesse: https://flow.microsoft.com
2. Abra o Flow que você criou
3. Clique no gatilho **"Quando uma solicitação HTTP é recebida"**
4. Copie a **URL do HTTP POST** que aparece
5. Exemplo:
   ```
   https://prod-xx.westus.logic.azure.com:443/workflows/xxx/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xxx
   ```

---

## ✅ Checklist de Configuração

- [ ] Flow criado no Power Automate
- [ ] Email `thenriquebaute@alvarezandmarsal.com` configurado no Flow
- [ ] URL do webhook copiada do Power Automate
- [ ] WebPart adicionado à página do SharePoint
- [ ] Propriedades do WebPart abertas
- [ ] URL do webhook colada no campo correto
- [ ] Alterações salvas/publicadas
- [ ] Teste realizado com sucesso

---

## 🐛 Troubleshooting

### O campo não aparece nas propriedades

- Verifique se o WebPart foi atualizado após o build
- Execute `gulp build` novamente
- Publique o pacote novamente no SharePoint

### URL não está sendo salva

- Verifique se você clicou em "Aplicar" antes de fechar o painel
- Verifique se você publicou a página após salvar
- Verifique o console do navegador para erros

### Notificações não funcionam mesmo com URL configurada

1. Verifique se a URL está correta (sem espaços extras)
2. Verifique se o Flow está ativado no Power Automate
3. Verifique o histórico de execuções do Flow
4. Verifique o console do navegador para erros de CORS ou fetch

---

## 📸 Visualização do Painel de Propriedades

```
┌─────────────────────────────────────────────┐
│ Propriedades do WebPart                     │
├─────────────────────────────────────────────┤
│                                             │
│ Basic                                       │
│ ┌─────────────────────────────────────────┐ │
│ │ Description:                            │ │
│ │ [___________________________]           │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Power Automate - Notificações Teams        │
│ ┌─────────────────────────────────────────┐ │
│ │ URL do Webhook - Notificações Teams:    │ │
│ │                                         │ │
│ │ [https://prod-xx.westus.logic...]      │ │ ← COLE AQUI
│ │                                         │ │
│ │ ℹ️ URL do Flow do Power Automate para  │ │
│ │   enviar notificações para             │ │
│ │   thenriquebaute@alvarezandmarsal.com  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Cancelar]  [Aplicar]                       │
└─────────────────────────────────────────────┘
```

---

## 🔗 Próximos Passos

Após configurar a URL:

1. ✅ Teste enviando uma dúvida
2. ✅ Verifique se a notificação chegou no Teams
3. ✅ Clique no botão "Responder no SharePoint" para testar
4. ✅ Verifique os logs do Power Automate se necessário

---

## 📚 Documentação Relacionada

- `POWER_AUTOMATE_TEAMS_SETUP.md` - Guia completo de configuração do Flow
- `TEAMS_NOTIFICATIONS_SETUP.md` - Documentação detalhada
- `TEAMS_CONFIG_EXAMPLE.md` - Exemplo rápido

