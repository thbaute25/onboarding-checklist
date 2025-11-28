# Integração com Power Automate

Este documento explica como configurar a integração do sistema de onboarding com Power Automate.

## 📋 Visão Geral

O sistema pode enviar dados para Power Automate em dois cenários:

1. **Mensagens do Chat**: Quando um usuário envia uma dúvida
2. **Progresso de Tarefas**: Quando um usuário completa tarefas

## 🔧 Configuração

### 1. Criar Flow para Mensagens do Chat

1. Acesse o Power Automate (https://flow.microsoft.com)
2. Crie um novo Flow
3. Escolha o gatilho: **"Quando uma solicitação HTTP é recebida"**
4. Configure o esquema JSON de entrada:

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
    }
  }
}
```

5. Adicione ações desejadas (ex: enviar email, criar item no SharePoint, etc.)
6. Salve o Flow e copie a **URL do webhook HTTP**

### 2. Criar Flow para Progresso de Tarefas

1. Crie outro Flow no Power Automate
2. Escolha o gatilho: **"Quando uma solicitação HTTP é recebida"**
3. Configure o esquema JSON:

```json
{
  "type": "object",
  "properties": {
    "usuario": {
      "type": "string"
    },
    "etapa": {
      "type": "string"
    },
    "tarefasConcluidas": {
      "type": "number"
    },
    "totalTarefas": {
      "type": "number"
    },
    "porcentagem": {
      "type": "number"
    },
    "dataHora": {
      "type": "string"
    }
  }
}
```

4. Adicione ações (ex: atualizar dashboard, notificar gestor, etc.)
5. Salve e copie a **URL do webhook HTTP**

### 3. Configurar no WebPart

#### Opção A: Via Código (Desenvolvimento)

Edite `ChecklistOnboardingWebPart.ts` e adicione as URLs:

```typescript
import { PowerAutomateService } from './services/PowerAutomateService';

// No método render() ou onInit():
const powerAutomateConfig = {
  chatWebhookUrl: 'https://prod-xx.westus.logic.azure.com:443/workflows/xxx/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xxx',
  progressoWebhookUrl: 'https://prod-xx.westus.logic.azure.com:443/workflows/yyy/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=yyy'
};

// Passar para os componentes:
element = React.createElement<IChatDuvidasProps>(
  ChatDuvidas,
  {
    userDisplayName: this.context.pageContext.user.displayName,
    powerAutomateConfig: powerAutomateConfig,
    onVoltar: () => { ... }
  }
);
```

#### Opção B: Via Propriedades do WebPart (Recomendado)

1. Adicione campos de propriedade no `getPropertyPaneConfiguration()`:

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
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('description', {
                label: strings.DescriptionFieldLabel
              }),
              PropertyPaneTextField('chatWebhookUrl', {
                label: 'URL do Webhook - Chat',
                description: 'URL do Flow do Power Automate para mensagens do chat'
              }),
              PropertyPaneTextField('progressoWebhookUrl', {
                label: 'URL do Webhook - Progresso',
                description: 'URL do Flow do Power Automate para progresso de tarefas'
              })
            ]
          }
        ]
      }
    ]
  };
}
```

2. Use as propriedades no render():

```typescript
const powerAutomateConfig = {
  chatWebhookUrl: this.properties.chatWebhookUrl,
  progressoWebhookUrl: this.properties.progressoWebhookUrl
};
```

## 📊 Dados Enviados

### Mensagem do Chat

```json
{
  "mensagem": "Como configurar meu email?",
  "usuario": "João Silva",
  "dataHora": "2024-01-15T10:30:00.000Z",
  "respostaAutomatica": false,
  "categoria": "Dúvida Nova"
}
```

### Progresso de Tarefas

```json
{
  "usuario": "João Silva",
  "etapa": "primeiroDia",
  "tarefasConcluidas": 3,
  "totalTarefas": 5,
  "porcentagem": 60,
  "dataHora": "2024-01-15T10:30:00.000Z"
}
```

## 🎯 Exemplos de Ações no Power Automate

### Para Mensagens do Chat:

- **Enviar Email**: Notificar RH sobre novas dúvidas
- **Criar Item no SharePoint**: Registrar dúvidas em uma lista
- **Enviar para Teams**: Postar mensagem em canal do Teams
- **Criar Ticket**: Integrar com sistema de tickets

### Para Progresso:

- **Atualizar Dashboard**: Atualizar Power BI ou SharePoint
- **Notificar Gestor**: Enviar email quando atingir marcos (50%, 100%)
- **Criar Relatório**: Gerar relatório semanal de progresso
- **Award Badge**: Conceder badges/conquistas

## 🔒 Segurança

- As URLs do webhook contêm tokens de segurança
- Mantenha as URLs seguras e não as compartilhe publicamente
- Use propriedades do WebPart para configuração por site/ambiente
- Considere usar Azure Key Vault para URLs sensíveis

## 🐛 Troubleshooting

### Mensagens não estão sendo enviadas

1. Verifique se a URL do webhook está correta
2. Verifique o console do navegador para erros
3. Teste o Flow manualmente no Power Automate
4. Verifique CORS se necessário

### Progresso não está sendo enviado

1. Verifique se `progressoWebhookUrl` está configurado
2. Verifique se o usuário tem permissões
3. Verifique logs do Power Automate

## 📝 Notas

- O envio para Power Automate é **assíncrono** e não bloqueia a interface
- Se o Power Automate não estiver configurado, o sistema continua funcionando normalmente
- Os dados são enviados apenas quando há eventos (mensagem enviada, tarefa concluída)

