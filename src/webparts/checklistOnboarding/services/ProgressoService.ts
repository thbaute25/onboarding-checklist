import { IStorageService, ITarefa } from './IStorageService';

export interface IProgressoGeral {
  totalTarefas: number;
  tarefasConcluidas: number;
  porcentagem: number;
  progressoPorEtapa: {
    primeiroDia: { total: number; concluidas: number; porcentagem: number };
    primeiraSemana: { total: number; concluidas: number; porcentagem: number };
    primeiroMes: { total: number; concluidas: number; porcentagem: number };
  };
}

export class ProgressoService {
  // Total de tarefas por etapa (hardcoded baseado nas tarefas padrão)
  private readonly TAREFAS_PRIMEIRO_DIA = 5;
  private readonly TAREFAS_PRIMEIRA_SEMANA = 7;
  private readonly TAREFAS_PRIMEIRO_MES = 9;

  /**
   * Calcula o progresso geral do onboarding
   */
  public async calcularProgressoGeral(storageService: IStorageService): Promise<IProgressoGeral> {
    const [tarefasPrimeiroDia, tarefasPrimeiraSemana, tarefasPrimeiroMes] = await Promise.all([
      storageService.carregarProgresso('primeiroDia'),
      storageService.carregarProgresso('primeiraSemana'),
      storageService.carregarProgresso('primeiroMes')
    ]);

    const progressoPrimeiroDia = this.calcularProgressoEtapa(
      tarefasPrimeiroDia || [],
      this.TAREFAS_PRIMEIRO_DIA
    );

    const progressoPrimeiraSemana = this.calcularProgressoEtapa(
      tarefasPrimeiraSemana || [],
      this.TAREFAS_PRIMEIRA_SEMANA
    );

    const progressoPrimeiroMes = this.calcularProgressoEtapa(
      tarefasPrimeiroMes || [],
      this.TAREFAS_PRIMEIRO_MES
    );

    const totalTarefas = this.TAREFAS_PRIMEIRO_DIA + this.TAREFAS_PRIMEIRA_SEMANA + this.TAREFAS_PRIMEIRO_MES;
    const tarefasConcluidas = 
      progressoPrimeiroDia.concluidas + 
      progressoPrimeiraSemana.concluidas + 
      progressoPrimeiroMes.concluidas;
    
    const porcentagem = totalTarefas > 0 
      ? Math.round((tarefasConcluidas / totalTarefas) * 100) 
      : 0;

    return {
      totalTarefas,
      tarefasConcluidas,
      porcentagem,
      progressoPorEtapa: {
        primeiroDia: progressoPrimeiroDia,
        primeiraSemana: progressoPrimeiraSemana,
        primeiroMes: progressoPrimeiroMes
      }
    };
  }

  /**
   * Calcula o progresso de uma etapa específica
   */
  private calcularProgressoEtapa(
    tarefas: ITarefa[],
    totalEsperado: number
  ): { total: number; concluidas: number; porcentagem: number } {
    let concluidas = 0;
    
    // Contar tarefas concluídas
    for (let i = 0; i < tarefas.length; i++) {
      if (tarefas[i].concluida) {
        concluidas++;
      }
    }

    // Se não há tarefas salvas, usar o total esperado como base
    const total = tarefas.length > 0 ? tarefas.length : totalEsperado;
    const porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    return {
      total,
      concluidas,
      porcentagem
    };
  }
}

