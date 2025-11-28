# 🔔 Notificações no Teams - Guia de Configuração

Este guia explica como configurar notificações automáticas no Microsoft Teams quando um usuário envia uma dúvida no chat de onboarding.

## 📧 Email do Responsável

**Email configurado para receber notificações:** `thenriquebaute@alvarezandmarsal.com`

> ⚠️ **IMPORTANTE:** Configure este email no Power Automate Flow para receber as notificações via DM (mensagem direta) no Teams.

## 📋 Visão Geral

Quando um usuário envia uma dúvida, o sistema pode:
- ✅ Enviar notificação para um canal do Teams
- ✅ Enviar DM (mensagem direta) para: **`thenriquebaute@alvarezandmarsal.com`**
- ✅ Incluir botão "Responder no SharePoint" na notificação

## 🔧 Configuração no Power Automate

### Passo 1: Criar Flow para Notificações do Teams

1. Acesse o Power Automate (https://flow.microsoft.com)
2. Crie um novo Flow
3. Escolha o gatilho: **"Quando uma solicitação HTTP é recebida"**

### Passo 2: Configurar Esquema JSON

Configure o esquema JSON de entrada:

```json
{
  "type": "object",
  "properties": {
    "mensagem": {
      "type": "string"
    },
    "usuario": {
      "type": "string"
    },
    "dataHora": {
      "type": "string"
    },
    "respostaAutomatica": {
      "type": "boolean"
    },
    "categoria": {
      "type": "string"
    },
    "sharePointUrl": {
      "type": "string"
    },
    "userId": {
      "type": "string"
    },
    "userEmail": {
      "type": "string"
    }
  }
}
```

### Passo 3: Adicionar Condição (Opcional)

Adicione uma condição para filtrar apenas dúvidas novas (não respostas automáticas):

```
respostaAutomatica é igual a false
```

### Passo 4: Enviar Notificação para Canal do Teams

1. Adicione a ação: **"Postar uma mensagem (V3)"** ou **"Postar mensagem em um chat ou canal"**
2. Configure:
   - **Team**: Selecione o time/equipe
   - **Channel**: Selecione o canal (ex: "Onboarding", "Suporte", "RH")
   - **Message**: Configure a mensagem

#### Exemplo de Mensagem para Canal:

```
📢 Nova Dúvida de Onboarding

👤 **Usuário:** @{triggerBody()?['usuario']}
📅 **Data/Hora:** @{triggerBody()?['dataHora']}
🏷️ **Categoria:** @{triggerBody()?['categoria']}

💬 **Dúvida:**
@{triggerBody()?['mensagem']}

[Responder no SharePoint](@{triggerBody()?['sharePointUrl']})
```

### Passo 5: Enviar DM para Pessoa Responsável (Alternativa)

Se preferir enviar DM em vez de canal:

1. Adicione a ação: **"Postar mensagem em um chat"**
2. Configure:
   - **Chat With**: Email da pessoa responsável: **`thenriquebaute@alvarezandmarsal.com`**
   - **Message**: Configure a mensagem

#### Exemplo de Mensagem para DM:

```
🔔 Nova Dúvida de Onboarding

👤 **Usuário:** @{triggerBody()?['usuario']}
📧 **Email:** @{triggerBody()?['userEmail']}
📅 **Data/Hora:** @{triggerBody()?['dataHora']}
🏷️ **Categoria:** @{triggerBody()?['categoria']}

💬 **Dúvida:**
@{triggerBody()?['mensagem']}

[Responder no SharePoint](@{triggerBody()?['sharePointUrl']})
```

**⚠️ IMPORTANTE:** Configure o email **`thenriquebaute@alvarezandmarsal.com`** como destinatário das notificações.

### Passo 6: Adicionar Botão de Ação (Opcional)

Para adicionar um botão clicável na mensagem:

1. Use a ação **"Postar mensagem adaptativa em um chat ou canal"**
2. Configure o Adaptive Card JSON:

```json
{
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "type": "AdaptiveCard",
        "version": "1.4",
        "body": [
          {
            "type": "TextBlock",
            "text": "📢 Nova Dúvida de Onboarding",
            "weight": "Bolder",
            "size": "Large"
          },
          {
            "type": "FactSet",
            "facts": [
              {
                "title": "👤 Usuário:",
                "value": "@{triggerBody()?['usuario']}"
              },
              {
                "title": "📅 Data/Hora:",
                "value": "@{triggerBody()?['dataHora']}"
              },
              {
                "title": "🏷️ Categoria:",
                "value": "@{triggerBody()?['categoria']}"
              }
            ]
          },
          {
            "type": "TextBlock",
            "text": "💬 **Dúvida:**",
            "weight": "Bolder",
            "spacing": "Medium"
          },
          {
            "type": "TextBlock",
            "text": "@{triggerBody()?['mensagem']}",
            "wrap": true
          }
        ],
        "actions": [
          {
            "type": "Action.OpenUrl",
            "title": "Responder no SharePoint",
            "url": "@{triggerBody()?['sharePointUrl']}"
          }
        ]
      }
    }
  ]
}
```

### Passo 7: Salvar e Copiar URL do Webhook

1. Salve o Flow
2. Copie a **URL do webhook HTTP** gerada
3. Configure no WebPart (veja próximo passo)

## ⚙️ Configurar no WebPart

### Opção 1: Via Código (Desenvolvimento)

Edite `ChecklistOnboardingWebPart.ts` ou `HomeOnboardingWebPart.ts`:

```typescript
import { PowerAutomateService } from './services/PowerAutomateService';

// No método render():
const powerAutomateConfig = {
  chatWebhookUrl: 'URL_DO_WEBHOOK_DO_FLOW',
  progressoWebhookUrl: 'URL_DO_WEBHOOK_PROGRESSO' // Opcional
};

// Passar para ChatDuvidas:
element = React.createElement<IChatDuvidasProps>(
  ChatDuvidas,
  {
    userDisplayName: this.context.pageContext.user.displayName,
    userId: this.context.pageContext.user.loginName,
    userEmail: this.context.pageContext.user.email,
    powerAutomateConfig: powerAutomateConfig,
    onVoltar: () => { ... }
  }
);
```

### Opção 2: Via Property Pane (Recomendado)

Adicione campos no `getPropertyPaneConfiguration()`:

```typescript
protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: 'Power Automate',
            groupFields: [
              PropertyPaneTextField('chatWebhookUrl', {
                label: 'URL do Webhook - Chat/Teams',
                description: 'URL do Flow do Power Automate para notificações no Teams'
              })
            ]
          }
        ]
      }
    ]
  };
}
```

## 📊 Dados Enviados

O sistema envia automaticamente:

```json
{
  "mensagem": "Como configurar meu email?",
  "usuario": "João Silva",
  "dataHora": "2024-01-15T10:30:00.000Z",
  "respostaAutomatica": false,
  "categoria": "Dúvida Nova",
  "sharePointUrl": "https://tenant.sharepoint.com/sites/Onboarding/SitePages/Home.aspx",
  "userId": "joao.silva@empresa.com",
  "userEmail": "joao.silva@empresa.com"
}
```

## 🎯 Exemplos de Fluxos

### Exemplo 1: Notificação Simples em Canal

```
Gatilho: HTTP Request
  ↓
Condição: respostaAutomatica = false
  ↓
Postar Mensagem no Canal "Onboarding"
  ↓
Mensagem com link para SharePoint
```

### Exemplo 2: Notificação com DM + Canal

```
Gatilho: HTTP Request
  ↓
Condição: respostaAutomatica = false
  ↓
Postar Mensagem no Canal "Onboarding"
  ↓
Postar DM para "thenriquebaute@alvarezandmarsal.com"
  ↓
Criar Item no SharePoint List "Dúvidas Pendentes"
```

### Exemplo 3: Notificação com Adaptive Card

```
Gatilho: HTTP Request
  ↓
Condição: respostaAutomatica = false
  ↓
Postar Adaptive Card no Canal
  ↓
Adaptive Card com:
  - Informações da dúvida
  - Botão "Responder no SharePoint"
  - Botão "Marcar como Resolvida"
```

## 🔒 Segurança e Permissões

- O Flow precisa ter permissões para:
  - Postar mensagens no Teams
  - Acessar canais do Teams
  - Enviar DMs (se aplicável)

- Configure as conexões do Power Automate:
  - Microsoft Teams
  - SharePoint (se necessário)

## 🐛 Troubleshooting

### Notificações não estão sendo enviadas

1. ✅ Verifique se a URL do webhook está correta
2. ✅ Verifique o console do navegador para erros
3. ✅ Teste o Flow manualmente no Power Automate
4. ✅ Verifique se `respostaAutomatica` está sendo filtrado corretamente
5. ✅ Verifique permissões do Flow no Teams

### Botão "Responder no SharePoint" não funciona

1. ✅ Verifique se `sharePointUrl` está sendo enviado
2. ✅ Verifique se a URL é acessível
3. ✅ Teste a URL manualmente no navegador

### Mensagens duplicadas

1. ✅ Verifique se há múltiplos Flows configurados
2. ✅ Verifique condições no Flow
3. ✅ Verifique se o webhook não está sendo chamado múltiplas vezes

## 📝 Notas Importantes

- ⚠️ Notificações são enviadas apenas para **dúvidas novas** (não respostas automáticas)
- ⚠️ O envio é **assíncrono** e não bloqueia a interface do usuário
- ⚠️ Se o Power Automate não estiver configurado, o sistema continua funcionando normalmente
- ✅ O botão "Responder no SharePoint" leva diretamente para a página do chat

## 🚀 Próximos Passos

Após configurar, você pode:
- Adicionar mais ações no Flow (ex: criar ticket, atualizar dashboard)
- Personalizar mensagens por categoria
- Adicionar @mentions para pessoas específicas
- Criar relatórios automáticos de dúvidas

