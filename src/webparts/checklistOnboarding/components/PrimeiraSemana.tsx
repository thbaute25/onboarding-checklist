import * as React from 'react';
import styles from './PrimeiraSemana.module.scss';
import type { IPrimeiraSemanaProps } from './IPrimeiraSemanaProps';
import { ITarefa } from '../services/IStorageService';
import { LocalStorageService } from '../services/LocalStorageService';

const TAREFAS_PADRAO: ITarefa[] = [
  { id: 1, descricao: 'Completar treinamento inicial obrigatório', concluida: false },
  { id: 2, descricao: 'Configurar ferramentas de desenvolvimento', concluida: false },
  { id: 3, descricao: 'Participar das reuniões semanais da equipe', concluida: false },
  { id: 4, descricao: 'Revisar processos e procedimentos internos', concluida: false },
  { id: 5, descricao: 'Configurar acesso a sistemas e aplicativos', concluida: false },
  { id: 6, descricao: 'Agendar reunião 1:1 com o gestor', concluida: false },
  { id: 7, descricao: 'Conhecer os principais projetos em andamento', concluida: false }
];

export default class PrimeiraSemana extends React.Component<IPrimeiraSemanaProps, { tarefas: ITarefa[]; carregando: boolean }> {
  private storageService = this.props.storageService || new LocalStorageService();

  constructor(props: IPrimeiraSemanaProps) {
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
      const progressoSalvo = await this.storageService.carregarProgresso('primeiraSemana');
      
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
      await this.storageService.salvarProgresso('primeiraSemana', novasTarefas);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }

  public render(): React.ReactElement<IPrimeiraSemanaProps> {
    return (
      <section className={styles.primeiraSemana}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Primeira Semana</h1>
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

