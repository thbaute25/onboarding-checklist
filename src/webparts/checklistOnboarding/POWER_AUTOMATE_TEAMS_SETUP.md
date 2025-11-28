# 🔔 Configuração Passo a Passo - Notificações Teams

## 📧 Email Configurado

**Email para receber notificações:** `thenriquebaute@alvarezandmarsal.com`

---

## 🚀 Passo a Passo Completo

### Passo 1: Criar o Flow no Power Automate

1. Acesse: https://flow.microsoft.com
2. Clique em **"Criar"** → **"Fluxo automatizado"**
3. Nome do Flow: `Notificações Onboarding - Teams`
4. Escolha o gatilho: **"Quando uma solicitação HTTP é recebida"**
5. Clique em **"Criar"**

### Passo 2: Configurar o Gatilho HTTP

1. No gatilho **"Quando uma solicitação HTTP é recebida"**, clique em **"Usar o esquema JSON de exemplo para gerar o payload"**
2. Cole o seguinte JSON:

```json
{
  "mensagem": "Como configurar meu email?",
  "usuario": "João Silva",
  "dataHora": "2024-01-15T10:30:00.000Z",
  "respostaAutomatica": false,
  "categoria": "Dúvida Nova",
  "sharePointUrl": "https://tenant.sharepoint.com/sites/Onboarding",
  "userId": "joao.silva@empresa.com",
  "userEmail": "joao.silva@empresa.com"
}
```

3. Clique em **"Concluído"**

### Passo 3: Adicionar Condição (Filtrar apenas dúvidas novas)

1. Clique em **"+ Novo passo"**
2. Procure e adicione: **"Condição"**
3. Configure:
   - **Primeiro valor**: `respostaAutomatica` (selecione do corpo da solicitação)
   - **Condição**: **é igual a**
   - **Segundo valor**: `false`
4. Isso garante que apenas dúvidas novas sejam notificadas (não respostas automáticas)

### Passo 4: Configurar Notificação para o Email Específico

#### No ramo "Se sim" (quando respostaAutomatica = false):

1. Clique em **"+ Adicionar uma ação"** dentro do ramo "Se sim"
2. Procure por: **"Postar mensagem em um chat"**
3. Selecione a ação: **"Postar mensagem em um chat (V3)"** ou **"Postar mensagem em um chat"**

#### ⚙️ Configuração da Ação:

1. **Chat With**: 
   - Clique no campo
   - Digite ou cole: **`thenriquebaute@alvarezandmarsal.com`**
   - ⚠️ **IMPORTANTE**: Use exatamente este email

2. **Message**: Cole o seguinte template:

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

### Passo 5: Salvar e Obter URL do Webhook

1. Clique em **"Salvar"** no canto superior direito
2. Aguarde o Flow ser salvo
3. Volte ao gatilho **"Quando uma solicitação HTTP é recebida"**
4. Copie a **URL do HTTP POST** que aparece no gatilho
   - Exemplo: `https://prod-xx.westus.logic.azure.com:443/workflows/xxx/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xxx`

### Passo 6: Configurar URL no WebPart

#### Opção A: Via Código (Temporário para teste)

Edite `HomeOnboardingWebPart.ts` ou `ChecklistOnboardingWebPart.ts`:

```typescript
import { PowerAutomateService } from './services/PowerAutomateService';

// No método render(), ao criar ChatDuvidas:
const powerAutomateConfig = {
  chatWebhookUrl: 'COLE_AQUI_A_URL_DO_WEBHOOK_COPIADA',
  progressoWebhookUrl: undefined // Opcional
};

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

#### Opção B: Via Property Pane (Recomendado para produção)

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
            groupName: 'Power Automate - Teams',
            groupFields: [
              PropertyPaneTextField('chatWebhookUrl', {
                label: 'URL do Webhook - Notificações Teams',
                description: 'URL do Flow do Power Automate para enviar notificações para thenriquebaute@alvarezandmarsal.com',
                value: '' // Cole a URL aqui ou deixe vazio para configurar via interface
              })
            ]
          }
        ]
      }
    ]
  };
}
```

### Passo 7: Testar

1. Salve todas as alterações
2. Execute `gulp build` e `gulp serve`
3. Acesse a página do SharePoint
4. Envie uma dúvida pelo chat
5. Verifique se a notificação chegou no Teams para `thenriquebaute@alvarezandmarsal.com`

---

## 📸 Capturas de Tela (Referência)

### Configuração do Campo "Chat With"

```
┌─────────────────────────────────────────┐
│ Postar mensagem em um chat             │
├─────────────────────────────────────────┤
│ Chat With:                              │
│ ┌─────────────────────────────────────┐ │
│ │ thenriquebaute@alvarezandmarsal.com │ │ ← COLE AQUI
│ └─────────────────────────────────────┘ │
│                                         │
│ Message:                                 │
│ ┌─────────────────────────────────────┐ │
│ │ 🔔 Nova Dúvida de Onboarding        │ │
│ │ ...                                  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist Final

- [ ] Flow criado no Power Automate
- [ ] Gatilho HTTP configurado com esquema JSON
- [ ] Condição adicionada: `respostaAutomatica = false`
- [ ] Ação "Postar mensagem em um chat" adicionada
- [ ] Campo "Chat With" preenchido com: `thenriquebaute@alvarezandmarsal.com`
- [ ] Template de mensagem configurado
- [ ] Flow salvo
- [ ] URL do webhook copiada
- [ ] URL configurada no WebPart
- [ ] Teste realizado com sucesso

---

## 🐛 Troubleshooting

### O email não aparece nas opções do Power Automate

- Digite o email manualmente no campo "Chat With"
- Certifique-se de que o email está correto: `thenriquebaute@alvarezandmarsal.com`
- Verifique se você tem permissão para enviar mensagens para este usuário

### Notificações não estão chegando

1. Verifique se o Flow está **ativado** (não pausado)
2. Verifique o histórico de execuções do Flow no Power Automate
3. Verifique se a URL do webhook está correta no código
4. Verifique o console do navegador para erros

### Erro de permissão

- Certifique-se de que o Flow tem permissão para:
  - Microsoft Teams (conexão configurada)
  - Enviar mensagens em chats

---

## 📞 Suporte

Se precisar de ajuda adicional, verifique:
- `TEAMS_NOTIFICATIONS_SETUP.md` - Documentação completa
- `TEAMS_CONFIG_EXAMPLE.md` - Exemplo rápido
- Logs do Power Automate para detalhes de erros

