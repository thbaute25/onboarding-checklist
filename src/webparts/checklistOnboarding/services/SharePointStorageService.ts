import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IStorageService, ITarefa } from './IStorageService';

export interface ISharePointStorageServiceConfig {
  spHttpClient: SPHttpClient;
  webUrl: string;
  listName: string;
  userId: string;
}

export class SharePointStorageService implements IStorageService {
  private config: ISharePointStorageServiceConfig;

  constructor(config: ISharePointStorageServiceConfig) {
    this.config = config;
  }

  private async ensureListExists(): Promise<void> {
    const listUrl = `${this.config.webUrl}/_api/web/lists/getbytitle('${this.config.listName}')`;
    
    try {
      await this.config.spHttpClient.get(
        listUrl,
        SPHttpClient.configurations.v1
      );
    } catch {
      // Lista não existe, criar
      await this.createList();
    }
  }

  private async createList(): Promise<void> {
    const createListUrl = `${this.config.webUrl}/_api/web/lists`;
    
    const listDefinition = {
      '__metadata': { 'type': 'SP.List' },
      'Title': this.config.listName,
      'Description': 'Lista para armazenar progresso do onboarding',
      'BaseTemplate': 100, // Custom List
      'ContentTypesEnabled': false
    };

    try {
      await this.config.spHttpClient.post(
        createListUrl,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'Content-Type': 'application/json;odata=nometadata',
            'odata-version': ''
          },
          body: JSON.stringify(listDefinition)
        }
      );

      // Adicionar campos necessários
      await this.addFields();
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      throw error;
    }
  }

  private async addFields(): Promise<void> {
    const fields = [
      { name: 'UserId', type: 'Text' },
      { name: 'Stage', type: 'Text' },
      { name: 'Tarefas', type: 'Note' }
    ];

    for (const field of fields) {
      try {
        const addFieldUrl = `${this.config.webUrl}/_api/web/lists/getbytitle('${this.config.listName}')/fields`;
        
        await this.config.spHttpClient.post(
          addFieldUrl,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-Type': 'application/json;odata=nometadata',
              'odata-version': ''
            },
            body: JSON.stringify({
              '__metadata': { 'type': `SP.Field${field.type}` },
              'Title': field.name,
              'FieldTypeKind': field.type === 'Text' ? 2 : 3
            })
          }
        );
      } catch {
        // Campo pode já existir, ignorar
        console.log(`Campo ${field.name} pode já existir`);
      }
    }
  }

  public async salvarProgresso(stage: string, tarefas: ITarefa[]): Promise<void> {
    await this.ensureListExists();

    const listUrl = `${this.config.webUrl}/_api/web/lists/getbytitle('${this.config.listName}')/items`;
    
    // Verificar se já existe um item para este usuário e estágio
    const existingItem = await this.getItemId(stage);
    
    const itemData = {
      '__metadata': { 'type': 'SP.Data.OnboardingProgressListItem' },
      'Title': `${this.config.userId}-${stage}`,
      'UserId': this.config.userId,
      'Stage': stage,
      'Tarefas': JSON.stringify(tarefas)
    };

    try {
      if (existingItem) {
        // Atualizar item existente
        const updateUrl = `${this.config.webUrl}/_api/web/lists/getbytitle('${this.config.listName}')/items(${existingItem})`;
        await this.config.spHttpClient.post(
          updateUrl,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-Type': 'application/json;odata=nometadata',
              'odata-version': '',
              'IF-MATCH': '*',
              'X-HTTP-Method': 'MERGE'
            },
            body: JSON.stringify(itemData)
          }
        );
      } else {
        // Criar novo item
        await this.config.spHttpClient.post(
          listUrl,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-Type': 'application/json;odata=nometadata',
              'odata-version': ''
            },
            body: JSON.stringify(itemData)
          }
        );
      }
    } catch (error) {
      console.error('Erro ao salvar progresso no SharePoint:', error);
      throw error;
    }
  }

  public async carregarProgresso(stage: string): Promise<ITarefa[] | undefined> {
    await this.ensureListExists();

    const itemId = await this.getItemId(stage);
    
    if (!itemId) {
      return undefined;
    }

    try {
      const itemUrl = `${this.config.webUrl}/_api/web/lists/getbytitle('${this.config.listName}')/items(${itemId})?$select=Tarefas`;
      
      const response: SPHttpClientResponse = await this.config.spHttpClient.get(
        itemUrl,
        SPHttpClient.configurations.v1
      );

      const data = await response.json();
      
      if (data && data.Tarefas) {
        return JSON.parse(data.Tarefas) as ITarefa[];
      }

      return undefined;
    } catch (error) {
      console.error('Erro ao carregar progresso do SharePoint:', error);
      return undefined;
    }
  }

  private async getItemId(stage: string): Promise<number | undefined> {
    try {
      const filterUrl = `${this.config.webUrl}/_api/web/lists/getbytitle('${this.config.listName}')/items?$filter=UserId eq '${this.config.userId}' and Stage eq '${stage}'&$select=Id`;
      
      const response: SPHttpClientResponse = await this.config.spHttpClient.get(
        filterUrl,
        SPHttpClient.configurations.v1
      );

      const data = await response.json();
      
      if (data.value && data.value.length > 0) {
        return data.value[0].Id;
      }

      return undefined;
    } catch (error) {
      console.error('Erro ao buscar item:', error);
      return undefined;
    }
  }

  public async limparProgresso(stage?: string): Promise<void> {
    await this.ensureListExists();

    if (stage) {
      const itemId = await this.getItemId(stage);
      if (itemId) {
        await this.deleteItem(itemId);
      }
    } else {
      // Limpar todos os estágios
      const stages = ['primeiroDia', 'primeiraSemana', 'primeiroMes'];
      for (const s of stages) {
        const itemId = await this.getItemId(s);
        if (itemId) {
          await this.deleteItem(itemId);
        }
      }
    }
  }

  private async deleteItem(itemId: number): Promise<void> {
    try {
      const deleteUrl = `${this.config.webUrl}/_api/web/lists/getbytitle('${this.config.listName}')/items(${itemId})`;
      
      await this.config.spHttpClient.post(
        deleteUrl,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'IF-MATCH': '*',
            'X-HTTP-Method': 'DELETE'
          }
        }
      );
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      throw error;
    }
  }
}

