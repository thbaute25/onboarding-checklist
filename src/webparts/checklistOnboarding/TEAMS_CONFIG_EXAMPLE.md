# ⚙️ Configuração Rápida - Notificações Teams

## 📧 Email do Responsável

**Email para receber notificações:** `thenriquebaute@alvarezandmarsal.com`

## 🔧 Configuração no Power Automate

### Opção 1: Enviar apenas DM (Mensagem Direta)

1. Crie um Flow no Power Automate
2. Gatilho: **"Quando uma solicitação HTTP é recebida"**
3. Adicione ação: **"Postar mensagem em um chat"**
4. Configure:
   - **Chat With**: `thenriquebaute@alvarezandmarsal.com`
   - **Message**: Veja template abaixo

### Template de Mensagem para DM:

```
🔔 Nova Dúvida de Onboarding

👤 **Usuário:** @{triggerBody()?['usuario']}
📧 **Email do Usuário:** @{triggerBody()?['userEmail']}
📅 **Data/Hora:** @{formatDateTime(triggerBody()?['dataHora'], 'dd/MM/yyyy HH:mm')}
🏷️ **Categoria:** @{triggerBody()?['categoria']}

💬 **Dúvida:**
@{triggerBody()?['mensagem']}

[📎 Responder no SharePoint](@{triggerBody()?['sharePointUrl']})
```

### Opção 2: Enviar para Canal + DM

1. Crie um Flow no Power Automate
2. Gatilho: **"Quando uma solicitação HTTP é recebida"**
3. Adicione condição: `respostaAutomatica` é igual a `false`
4. Adicione ação: **"Postar mensagem em um chat ou canal"**
   - **Team**: Selecione o time
   - **Channel**: Selecione o canal (ex: "Onboarding", "Suporte")
   - **Message**: Use o template acima
5. Adicione ação: **"Postar mensagem em um chat"**
   - **Chat With**: `thenriquebaute@alvarezandmarsal.com`
   - **Message**: Use o template acima

## 📋 Esquema JSON do Gatilho HTTP

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

## ✅ Checklist de Configuração

- [ ] Flow criado no Power Automate
- [ ] Gatilho HTTP configurado com esquema JSON
- [ ] Condição adicionada para filtrar apenas dúvidas novas (`respostaAutomatica = false`)
- [ ] Ação de postar mensagem configurada com email: `thenriquebaute@alvarezandmarsal.com`
- [ ] Botão "Responder no SharePoint" incluído na mensagem
- [ ] URL do webhook copiada
- [ ] URL configurada no WebPart (via código ou Property Pane)

## 🧪 Teste

1. Envie uma dúvida pelo chat
2. Verifique se a notificação chegou no Teams para `thenriquebaute@alvarezandmarsal.com`
3. Clique no botão "Responder no SharePoint" para verificar se funciona

## 🔗 Links Úteis

- Power Automate: https://flow.microsoft.com
- Documentação completa: `TEAMS_NOTIFICATIONS_SETUP.md`

