import * as React from 'react';
import styles from './BarraProgresso.module.scss';
import type { IBarraProgressoProps } from './IBarraProgressoProps';

export default class BarraProgresso extends React.Component<IBarraProgressoProps> {
  public render(): React.ReactElement<IBarraProgressoProps> {
    const { porcentagem, tarefasConcluidas, totalTarefas, progressoPorEtapa } = this.props.progresso;

    return (
      <div className={styles.barraProgressoContainer}>
        <div className={styles.progressoHeader}>
          <div className={styles.progressoInfo}>
            <h2 className={styles.progressoTitulo}>Progresso do Onboarding</h2>
            <p className={styles.progressoTexto}>
              {tarefasConcluidas} de {totalTarefas} tarefas concluídas
            </p>
          </div>
          <div className={styles.progressoPorcentagem}>
            <span className={styles.porcentagemNumero}>{porcentagem}%</span>
          </div>
        </div>

        {/* Barra de progresso principal */}
        <div className={styles.barraProgressoWrapper}>
          <div 
            className={styles.barraProgresso}
            style={{ width: `${porcentagem}%` }}
            role="progressbar"
            aria-valuenow={porcentagem}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${porcentagem}% do onboarding concluído`}
          >
            <div className={styles.barraProgressoFill} />
          </div>
        </div>

        {/* Progresso por etapa */}
        <div className={styles.progressoEtapas}>
          <div className={styles.etapa}>
            <div className={styles.etapaHeader}>
              <span className={styles.etapaNome}>Primeiro Dia</span>
              <span className={styles.etapaPorcentagem}>
                {progressoPorEtapa.primeiroDia.concluidas}/{progressoPorEtapa.primeiroDia.total} ({progressoPorEtapa.primeiroDia.porcentagem}%)
              </span>
            </div>
            <div className={styles.etapaBarraWrapper}>
              <div 
                className={`${styles.etapaBarra} ${styles.etapaBarra1}`}
                style={{ width: `${progressoPorEtapa.primeiroDia.porcentagem}%` }}
              />
            </div>
          </div>

          <div className={styles.etapa}>
            <div className={styles.etapaHeader}>
              <span className={styles.etapaNome}>Primeira Semana</span>
              <span className={styles.etapaPorcentagem}>
                {progressoPorEtapa.primeiraSemana.concluidas}/{progressoPorEtapa.primeiraSemana.total} ({progressoPorEtapa.primeiraSemana.porcentagem}%)
              </span>
            </div>
            <div className={styles.etapaBarraWrapper}>
              <div 
                className={`${styles.etapaBarra} ${styles.etapaBarra2}`}
                style={{ width: `${progressoPorEtapa.primeiraSemana.porcentagem}%` }}
              />
            </div>
          </div>

          <div className={styles.etapa}>
            <div className={styles.etapaHeader}>
              <span className={styles.etapaNome}>Primeiro Mês</span>
              <span className={styles.etapaPorcentagem}>
                {progressoPorEtapa.primeiroMes.concluidas}/{progressoPorEtapa.primeiroMes.total} ({progressoPorEtapa.primeiroMes.porcentagem}%)
              </span>
            </div>
            <div className={styles.etapaBarraWrapper}>
              <div 
                className={`${styles.etapaBarra} ${styles.etapaBarra3}`}
                style={{ width: `${progressoPorEtapa.primeiroMes.porcentagem}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

