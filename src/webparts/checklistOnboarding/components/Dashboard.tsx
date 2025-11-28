import * as React from 'react';
import styles from './Dashboard.module.scss';
import type { IDashboardProps } from './IDashboardProps';
import { DashboardService, IDashboardData } from '../services/DashboardService';

export default class Dashboard extends React.Component<IDashboardProps, { dados: IDashboardData | undefined; carregando: boolean }> {
  private dashboardService = new DashboardService();

  constructor(props: IDashboardProps) {
    super(props);
    this.state = {
      dados: undefined,
      carregando: true
    };
  }

  public componentDidMount(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    try {
      const dados = this.dashboardService.calcularEstatisticas();
      this.setState({ dados, carregando: false });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      this.setState({ carregando: false });
    }
  }

  public render(): React.ReactElement<IDashboardProps> {
    if (this.state.carregando) {
      return (
        <section className={styles.dashboard}>
          <div className={styles.container}>
            <div className={styles.loading}>
              <p>Carregando estatísticas...</p>
            </div>
          </div>
        </section>
      );
    }

    if (!this.state.dados) {
      return (
        <section className={styles.dashboard}>
          <div className={styles.container}>
            <div className={styles.empty}>
              <p>Nenhum dado disponível ainda.</p>
            </div>
          </div>
        </section>
      );
    }

    const { dados } = this.state;

    return (
      <section className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.titulo}>Dashboard de Dúvidas</h1>
              <p className={styles.subtitulo}>Estatísticas e análises do onboarding</p>
            </div>
            {this.props.onVoltar && (
              <button
                className={styles.botaoVoltar}
                onClick={this.props.onVoltar}
              >
                ← Voltar
              </button>
            )}
          </div>

          {/* Cards de Resumo */}
          <div className={styles.cardsResumo}>
            <div className={styles.cardResumo}>
              <div className={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitulo}>Total de Dúvidas</h3>
                <p className={styles.cardValor}>{dados.totalDuvidas}</p>
              </div>
            </div>

            <div className={styles.cardResumo}>
              <div className={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitulo}>Usuários Únicos</h3>
                <p className={styles.cardValor}>{dados.totalUsuarios}</p>
              </div>
            </div>

            <div className={styles.cardResumo}>
              <div className={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitulo}>Tempo Médio de Resposta</h3>
                <p className={styles.cardValor}>{dados.tempoMedioResposta.tempoMedioFormatado}</p>
              </div>
            </div>

            <div className={styles.cardResumo}>
              <div className={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitulo}>Categoria com Mais Dúvidas</h3>
                <p className={styles.cardValor}>{dados.categoriaComMaisDor}</p>
              </div>
            </div>
          </div>

          {/* Dúvidas por Categoria */}
          <div className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Dúvidas por Categoria</h2>
            <div className={styles.categoriasLista}>
              {dados.duvidasPorCategoria.length === 0 ? (
                <p className={styles.empty}>Nenhuma categoria encontrada.</p>
              ) : (
                dados.duvidasPorCategoria.map((cat, index) => (
                  <div key={index} className={styles.categoriaItem}>
                    <div className={styles.categoriaHeader}>
                      <span className={styles.categoriaNome}>{cat.categoria}</span>
                      <span className={styles.categoriaQuantidade}>{cat.quantidade} ({cat.porcentagem}%)</span>
                    </div>
                    <div className={styles.categoriaBarraWrapper}>
                      <div
                        className={styles.categoriaBarra}
                        style={{ width: `${cat.porcentagem}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dúvidas Mais Comuns */}
          <div className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Dúvidas Mais Comuns</h2>
            <div className={styles.duvidasLista}>
              {dados.duvidasMaisComuns.length === 0 ? (
                <p className={styles.empty}>Nenhuma dúvida encontrada.</p>
              ) : (
                dados.duvidasMaisComuns.map((duvida, index) => (
                  <div key={index} className={styles.duvidaItem}>
                    <div className={styles.duvidaRank}>{index + 1}</div>
                    <div className={styles.duvidaContent}>
                      <p className={styles.duvidaTexto}>{duvida.texto}</p>
                      <div className={styles.duvidaMeta}>
                        <span className={styles.duvidaCategoria}>{duvida.categoria}</span>
                        <span className={styles.duvidaQuantidade}>{duvida.quantidade} vez{duvida.quantidade !== 1 ? 'es' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dúvidas por Dia */}
          {dados.duvidasPorDia.length > 0 && (
            <div className={styles.secao}>
              <h2 className={styles.secaoTitulo}>Dúvidas por Dia (Últimos 30 dias)</h2>
              <div className={styles.graficoContainer}>
                <div className={styles.graficoBarras}>
                  {dados.duvidasPorDia.map((item, index) => (
                    <div key={index} className={styles.barraItem}>
                      <div
                        className={styles.barra}
                        style={{ height: `${Math.max((item.quantidade / this.getMaxDuvidasPorDia(dados.duvidasPorDia)) * 100, 10)}%` }}
                        title={`${item.data}: ${item.quantidade} dúvida${item.quantidade !== 1 ? 's' : ''}`}
                      />
                      <span className={styles.barraLabel}>{item.quantidade}</span>
                      <span className={styles.barraData}>{item.data.split('/')[0]}/{item.data.split('/')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  private getMaxDuvidasPorDia(duvidasPorDia: Array<{ data: string; quantidade: number }>): number {
    let max = 0;
    for (let i = 0; i < duvidasPorDia.length; i++) {
      if (duvidasPorDia[i].quantidade > max) {
        max = duvidasPorDia[i].quantidade;
      }
    }
    return max || 1; // Evitar divisão por zero
  }
}

