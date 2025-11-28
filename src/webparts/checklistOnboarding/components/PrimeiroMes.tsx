import * as React from 'react';
import styles from './PrimeiroMes.module.scss';
import type { IPrimeiroMesProps } from './IPrimeiroMesProps';
import { ITarefa } from '../services/IStorageService';
import { LocalStorageService } from '../services/LocalStorageService';

const TAREFAS_PADRAO: ITarefa[] = [
  { id: 1, descricao: 'Completar todos os treinamentos obrigatórios', concluida: false },
  { id: 2, descricao: 'Entregar primeiro projeto ou tarefa significativa', concluida: false },
  { id: 3, descricao: 'Estabelecer relacionamentos com colegas de diferentes departamentos', concluida: false },
  { id: 4, descricao: 'Participar ativamente das reuniões e contribuir com ideias', concluida: false },
  { id: 5, descricao: 'Revisar e entender os objetivos estratégicos da empresa', concluida: false },
  { id: 6, descricao: 'Configurar e otimizar ambiente de trabalho', concluida: false },
  { id: 7, descricao: 'Receber feedback formal do gestor sobre o primeiro mês', concluida: false },
  { id: 8, descricao: 'Definir metas e objetivos para os próximos meses', concluida: false },
  { id: 9, descricao: 'Completar avaliação de desempenho inicial', concluida: false }
];

export default class PrimeiroMes extends React.Component<IPrimeiroMesProps, { tarefas: ITarefa[]; carregando: boolean }> {
  private storageService = this.props.storageService || new LocalStorageService();

  constructor(props: IPrimeiroMesProps) {
    super(props);
    
    this.state = {
      tarefas: TAREFAS_PADRAO,
      carregando: true
    };
  }

  public async componentDidMount(): Promise<void> {
    await this.carregarProgresso();
  }

  private async carregarProgresso(): Promise<void> {
    try {
      const progressoSalvo = await this.storageService.carregarProgresso('primeiroMes');
      
      if (progressoSalvo && progressoSalvo.length > 0) {
        const tarefasMescladas = TAREFAS_PADRAO.map((tarefaPadrao: ITarefa) => {
          let tarefaSalva: ITarefa | undefined;
          for (let i = 0; i < progressoSalvo.length; i++) {
            if (progressoSalvo[i].id === tarefaPadrao.id) {
              tarefaSalva = progressoSalvo[i];
              break;
            }
          }
          return tarefaSalva || tarefaPadrao;
        });
        
        this.setState({ tarefas: tarefasMescladas, carregando: false });
      } else {
        this.setState({ carregando: false });
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      this.setState({ carregando: false });
    }
  }

  private _handleToggleTarefa = async (id: number): Promise<void> => {
    const novasTarefas = this.state.tarefas.map(tarefa =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    );

    this.setState({ tarefas: novasTarefas });

    try {
      await this.storageService.salvarProgresso('primeiroMes', novasTarefas);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }

  public render(): React.ReactElement<IPrimeiroMesProps> {
    return (
      <section className={styles.primeiroMes}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Primeiro Mês</h1>
          {this.props.onVoltar && (
            <button 
              className={styles.botaoVoltar}
              onClick={this.props.onVoltar}
            >
              ← Voltar ao início
            </button>
          )}
        </div>
        <div className={styles.listaTarefas}>
          {this.state.tarefas.map(tarefa => (
            <div key={tarefa.id} className={styles.itemTarefa}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={tarefa.concluida}
                  onChange={() => this._handleToggleTarefa(tarefa.id)}
                  className={styles.checkbox}
                />
                <span className={tarefa.concluida ? styles.tarefaConcluida : styles.tarefaTexto}>
                  {tarefa.descricao}
                </span>
              </label>
            </div>
          ))}
        </div>
      </section>
    );
  }
}

