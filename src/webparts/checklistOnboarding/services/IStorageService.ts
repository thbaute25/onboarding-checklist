export interface ITarefa {
  id: number;
  descricao: string;
  concluida: boolean;
}

export interface IProgressoData {
  primeiroDia: ITarefa[];
  primeiraSemana: ITarefa[];
  primeiroMes: ITarefa[];
}

export interface IStorageService {
  salvarProgresso(stage: string, tarefas: ITarefa[]): Promise<void>;
  carregarProgresso(stage: string): Promise<ITarefa[] | undefined>;
  limparProgresso(stage?: string): Promise<void>;
}

