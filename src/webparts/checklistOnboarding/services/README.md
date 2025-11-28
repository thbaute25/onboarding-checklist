# Serviços de Persistência

Este projeto suporta dois métodos de persistência para salvar o progresso das tarefas de onboarding:

## 1. LocalStorage (Padrão)

O `LocalStorageService` é usado por padrão e salva os dados no navegador do usuário.

**Vantagens:**
- ✅ Implementação simples e rápida
- ✅ Não requer configuração adicional
- ✅ Funciona imediatamente

**Desvantagens:**
- ❌ Dados apenas no navegador atual
- ❌ Perdidos ao limpar cache/cookies
- ❌ Não sincroniza entre dispositivos

**Uso atual:** O WebPart já está configurado para usar LocalStorage por padrão.

## 2. SharePoint List (Profissional)

O `SharePointStorageService` salva os dados em uma lista do SharePoint, permitindo persistência entre dispositivos e acesso administrativo.

**Vantagens:**
- ✅ Dados persistentes no SharePoint
- ✅ Sincronização entre dispositivos
- ✅ Acesso administrativo aos dados
- ✅ Histórico e auditoria

**Desvantagens:**
- ❌ Requer configuração inicial
- ❌ Requer permissões no SharePoint
- ❌ Mais complexo de implementar

### Como usar SharePoint List:

1. **Instalar dependência** (se necessário):
   ```bash
   npm install @microsoft/sp-http
   ```

2. **Atualizar o WebPart** para usar SharePointStorageService:

   No arquivo `ChecklistOnboardingWebPart.ts`, substitua:
   ```typescript
   private _storageService: IStorageService = new LocalStorageService();
   ```

   Por:
   ```typescript
   import { SharePointStorageService } from './services/SharePointStorageService';
   import { SPHttpClient } from '@microsoft/sp-http';

   // No método render() ou onInit():
   private _storageService: IStorageService = new SharePointStorageService({
     spHttpClient: this.context.spHttpClient,
     webUrl: this.context.pageContext.web.absoluteUrl,
     listName: 'OnboardingProgress', // Nome da lista
     userId: this.context.pageContext.user.loginName
   });
   ```

3. **Criar a lista no SharePoint** (opcional):
   - O serviço criará automaticamente a lista se ela não existir
   - Ou você pode criar manualmente uma lista chamada "OnboardingProgress"

## Estrutura dos Dados

Ambos os serviços salvam os dados no mesmo formato:

```typescript
interface ITarefa {
  id: number;
  descricao: string;
  concluida: boolean;
}
```

Os dados são salvos por estágio:
- `primeiroDia`: Array de tarefas do primeiro dia
- `primeiraSemana`: Array de tarefas da primeira semana
- `primeiroMes`: Array de tarefas do primeiro mês

## Métodos Disponíveis

```typescript
// Salvar progresso de um estágio
await storageService.salvarProgresso('primeiroDia', tarefas);

// Carregar progresso de um estágio
const tarefas = await storageService.carregarProgresso('primeiroDia');

// Limpar progresso (opcional: especificar estágio ou limpar todos)
await storageService.limparProgresso('primeiroDia');
await storageService.limparProgresso(); // Limpa todos
```

