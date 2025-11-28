import * as React from 'react';
import styles from './Home.module.scss';
import type { IHomeProps } from './IHomeProps';

export default class Home extends React.Component<IHomeProps> {
  private _handleButtonClick = (stage: string): void => {
    this.props.onSelectStage(stage);
  }

  public render(): React.ReactElement<IHomeProps> {
    return (
      <section className={styles.home}>
        <div className={styles.container}>
          <h1 className={styles.titulo}>Onboarding A&M</h1>
          <p className={styles.subtitulo}>Bem-vindo ao seu processo de integração</p>
          
          <div className={styles.botoesContainer}>
            <button
              className={`${styles.botaoPrincipal} ${styles.botaoTarefas}`}
              onClick={() => this._handleButtonClick('tarefas')}
            >
              <div className={styles.botaoIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" fill="currentColor"/>
                </svg>
              </div>
              <h2 className={styles.botaoTitulo}>Tarefas do Mês</h2>
              <p className={styles.botaoDescricao}>Acompanhe suas tarefas de onboarding</p>
            </button>

            <button
              className={`${styles.botaoPrincipal} ${styles.botaoDuvidas}`}
              onClick={() => this._handleButtonClick('duvidas')}
            >
              <div className={styles.botaoIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="currentColor"/>
                </svg>
              </div>
              <h2 className={styles.botaoTitulo}>Enviar Dúvidas</h2>
              <p className={styles.botaoDescricao}>Tire suas dúvidas durante o processo</p>
            </button>
          </div>
        </div>
      </section>
    );
  }
}
