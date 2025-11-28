import { IStorageService, ITarefa } from './IStorageService';

export class LocalStorageService implements IStorageService {
  private readonly STORAGE_KEY_PREFIX = 'onboarding-checklist-';

  private getStorageKey(stage: string): string {
    return `${this.STORAGE_KEY_PREFIX}${stage}`;
  }

  public async salvarProgresso(stage: string, tarefas: ITarefa[]): Promise<void> {
    try {
      const key = this.getStorageKey(stage);
      localStorage.setItem(key, JSON.stringify(tarefas));
    } catch (error) {
      console.error('Erro ao salvar progresso no LocalStorage:', error);
      throw error;
    }
  }

  public async carregarProgresso(stage: string): Promise<ITarefa[] | undefined> {
    try {
      const key = this.getStorageKey(stage);
      const data = localStorage.getItem(key);
      
      if (!data) {
        return undefined;
      }

      return JSON.parse(data) as ITarefa[];
    } catch (error) {
      console.error('Erro ao carregar progresso do LocalStorage:', error);
      return undefined;
    }
  }

  public async limparProgresso(stage?: string): Promise<void> {
    try {
      if (stage) {
        const key = this.getStorageKey(stage);
        localStorage.removeItem(key);
      } else {
        // Limpar todos os estágios
        const stages = ['primeiroDia', 'primeiraSemana', 'primeiroMes'];
        stages.forEach(s => {
          localStorage.removeItem(this.getStorageKey(s));
        });
      }
    } catch (error) {
      console.error('Erro ao limpar progresso do LocalStorage:', error);
      throw error;
    }
  }
}

