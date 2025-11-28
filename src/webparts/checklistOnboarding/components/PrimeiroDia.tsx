import * as React from 'react';
import styles from './PrimeiroDia.module.scss';
import type { IPrimeiroDiaProps } from './IPrimeiroDiaProps';
import { ITarefa } from '../services/IStorageService';
import { LocalStorageService } from '../services/LocalStorageService';

const TAREFAS_PADRAO: ITarefa[] = [
  { id: 1, descricao: 'Configurar acesso ao sistema', concluida: false },
  { id: 2, descricao: 'Revisar documentação da empresa', concluida: false },
  { id: 3, descricao: 'Configurar email corporativo', concluida: false },
  { id: 4, descricao: 'Participar da reunião de boas-vindas', concluida: false },
  { id: 5, descricao: 'Conhecer a equipe', concluida: false }
];

export default class PrimeiroDia extends React.Component<IPrimeiroDiaProps, { tarefas: ITarefa[]; carregando: boolean }> {
  private storageService = this.props.storageService || new LocalStorageService();

  constructor(props: IPrimeiroDiaProps) {
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
      const progressoSalvo = await this.storageService.carregarProgresso('primeiroDia');
      
      if (progressoSalvo && progressoSalvo.length > 0) {
        // Mesclar tarefas salvas com padrão (caso novas tarefas sejam adicionadas)
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

    // Salvar progresso
    try {
      await this.storageService.salvarProgresso('primeiroDia', novasTarefas);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }

  public render(): React.ReactElement<IPrimeiroDiaProps> {
    return (
      <section className={styles.primeiroDia}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Primeiro Dia</h1>
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

