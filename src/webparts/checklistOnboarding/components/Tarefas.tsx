import * as React from 'react';
import styles from './Tarefas.module.scss';
import type { ITarefasProps } from './ITarefasProps';
import { LocalStorageService } from '../services/LocalStorageService';
import { ProgressoService } from '../services/ProgressoService';
import { IProgressoGeral } from '../services/ProgressoService';
import BarraProgresso from './BarraProgresso';

export default class Tarefas extends React.Component<ITarefasProps, { progresso: IProgressoGeral | undefined; carregando: boolean }> {
  private storageService = this.props.storageService || new LocalStorageService();
  private progressoService = new ProgressoService();

  constructor(props: ITarefasProps) {
    super(props);
    this.state = {
      progresso: undefined,
      carregando: true
    };
  }

  public async componentDidMount(): Promise<void> {
    await this.carregarProgresso();
    
    // Adicionar listener para atualizar progresso quando voltar para esta tela
    window.addEventListener('focus', this.handleWindowFocus);
  }

  public componentWillUnmount(): void {
    window.removeEventListener('focus', this.handleWindowFocus);
  }

  private handleWindowFocus = async (): Promise<void> => {
    await this.carregarProgresso();
  }

  public async componentDidUpdate(prevProps: ITarefasProps): Promise<void> {
    // Recarregar progresso se o storageService mudou
    if (prevProps.storageService !== this.props.storageService) {
      this.storageService = this.props.storageService || new LocalStorageService();
      await this.carregarProgresso();
    }
  }

  private async carregarProgresso(): Promise<void> {
    try {
      const progresso = await this.progressoService.calcularProgressoGeral(this.storageService);
      this.setState({ progresso, carregando: false });
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      this.setState({ carregando: false });
    }
  }

  private _handleCardClick = (stage: string): void => {
    // Recarregar progresso antes de navegar para garantir dados atualizados
    this.carregarProgresso().catch(() => {
      // Ignorar erros silenciosamente
    });
    this.props.onSelectStage(stage);
  }

  public render(): React.ReactElement<ITarefasProps> {
    return (
      <section className={styles.tarefas}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.titulo}>Tarefas do Mês</h1>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.botaoDashboard}
                onClick={() => this.props.onSelectStage('dashboard')}
                title="Ver dashboard de estatísticas"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
                </svg>
                Dashboard
              </button>
              {this.props.onVoltar && (
                <button
                  className={styles.botaoVoltar}
                  onClick={this.props.onVoltar}
                >
                  ← Voltar ao início
                </button>
              )}
            </div>
          </div>

          {/* Barra de Progresso */}
          {!this.state.carregando && this.state.progresso && (
            <BarraProgresso progresso={this.state.progresso} />
          )}
          
          <div className={styles.cardsContainer}>
            <div 
              className={styles.card}
              onClick={() => this._handleCardClick('primeiroDia')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this._handleCardClick('primeiroDia');
                }
              }}
            >
              <div className={styles.cardIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <h2 className={styles.cardTitulo}>Primeiro Dia</h2>
              <p className={styles.cardDescricao}>Inicie sua jornada com as tarefas essenciais do primeiro dia</p>
            </div>

            <div 
              className={styles.card}
              onClick={() => this._handleCardClick('primeiraSemana')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this._handleCardClick('primeiraSemana');
                }
              }}
            >
              <div className={styles.cardIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/>
                </svg>
              </div>
              <h2 className={styles.cardTitulo}>Primeira Semana</h2>
              <p className={styles.cardDescricao}>Continue sua adaptação com as atividades da primeira semana</p>
            </div>

            <div 
              className={styles.card}
              onClick={() => this._handleCardClick('primeiroMes')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  this._handleCardClick('primeiroMes');
                }
              }}
            >
              <div className={styles.cardIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" fill="currentColor"/>
                </svg>
              </div>
              <h2 className={styles.cardTitulo}>Primeiro Mês</h2>
              <p className={styles.cardDescricao}>Complete sua integração com as metas do primeiro mês</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

