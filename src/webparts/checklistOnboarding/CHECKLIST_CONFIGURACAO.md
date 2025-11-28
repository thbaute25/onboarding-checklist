# ✅ Checklist de Configuração - Notificações Teams

## 📋 O que já está pronto no código:

- ✅ Serviço `PowerAutomateService` criado
- ✅ Integração no componente `ChatDuvidas` implementada
- ✅ Campo no Property Pane do WebPart adicionado
- ✅ Envio automático de dados configurado
- ✅ Email `thenriquebaute@alvarezandmarsal.com` documentado

---

## 🔧 O que você precisa fazer:

### 1️⃣ Criar Flow no Power Automate

**O que fazer:**
1. Acesse: https://flow.microsoft.com
2. Crie um novo Flow com gatilho HTTP
3. Configure o email `thenriquebaute@alvarezandmarsal.com` no campo "Chat With"
4. Salve o Flow

**Documentação:** Veja `POWER_AUTOMATE_TEAMS_SETUP.md` para passo a passo completo

### 2️⃣ Obter URL do Webhook

**O que fazer:**
1. No Flow criado, clique no gatilho "Quando uma solicitação HTTP é recebida"
2. Copie a **URL do HTTP POST** que aparece
3. Exemplo de URL:
   ```
   https://prod-xx.westus.logic.azure.com:443/workflows/xxx/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xxx
   ```

### 3️⃣ Configurar URL no WebPart

**Opção A: Via Interface do SharePoint (Mais Fácil)**

1. Vá para a página do SharePoint onde o WebPart está
2. Clique em **"Editar"** (modo de edição)
3. Passe o mouse sobre o WebPart **"Home Onboarding"**
4. Clique no ícone **⚙️** (engrenagem) ou **"Editar WebPart"**
5. No painel à direita, role até **"Power Automate - Notificações Teams"**
6. Cole a URL do webhook no campo **"URL do Webhook - Notificações Teams"**
7. Clique em **"Aplicar"**
8. Clique em **"Publicar"** na página

**Opção B: Via Código (Para desenvolvimento)**

Se quiser configurar diretamente no código, edite `HomeOnboardingWebPart.ts`:

```typescript
// Linha ~35, no case 'duvidas':
const powerAutomateConfig: IPowerAutomateConfig = {
  chatWebhookUrl: 'COLE_AQUI_A_URL_DO_WEBHOOK', // ← Cole a URL aqui
  progressoWebhookUrl: undefined
};
```

Depois execute `gulp build` e `gulp serve`.

---

## 📊 Resumo do que precisa:

| Item | Status | Onde fazer |
|------|--------|------------|
| Flow no Power Automate | ⏳ **Você precisa criar** | Power Automate (flow.microsoft.com) |
| Email configurado no Flow | ⏳ **Você precisa configurar** | Campo "Chat With" no Flow |
| URL do webhook | ⏳ **Você precisa copiar** | Do gatilho HTTP do Flow |
| Configurar URL no WebPart | ⏳ **Você precisa configurar** | Property Pane do SharePoint ou código |

---

## 🎯 Passo a Passo Rápido:

1. **Criar Flow** → Power Automate → Novo Flow → Gatilho HTTP
2. **Configurar Email** → Ação "Postar mensagem em um chat" → `thenriquebaute@alvarezandmarsal.com`
3. **Copiar URL** → Do gatilho HTTP do Flow
4. **Configurar no SharePoint** → Editar WebPart → Property Pane → Cole a URL
5. **Testar** → Enviar uma dúvida pelo chat

---

## 📝 Informações que você precisa ter:

- ✅ **Email do responsável:** `thenriquebaute@alvarezandmarsal.com` (já configurado)
- ⏳ **URL do webhook:** Você obtém após criar o Flow no Power Automate
- ✅ **Template de mensagem:** Já está na documentação (`POWER_AUTOMATE_TEAMS_SETUP.md`)

---

## 🔗 Arquivos de Ajuda:

- `POWER_AUTOMATE_TEAMS_SETUP.md` - Guia completo passo a passo
- `CONFIGURAR_WEBHOOK_URL.md` - Como configurar a URL no WebPart
- `TEAMS_CONFIG_EXAMPLE.md` - Exemplo rápido de configuração

---

## ❓ Precisa de ajuda?

Se tiver dúvidas sobre:
- **Como criar o Flow:** Veja `POWER_AUTOMATE_TEAMS_SETUP.md`
- **Como configurar a URL:** Veja `CONFIGURAR_WEBHOOK_URL.md`
- **Template da mensagem:** Veja `TEAMS_CONFIG_EXAMPLE.md`

