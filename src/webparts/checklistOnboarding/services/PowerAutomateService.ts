/**
 * Serviço para integração com Power Automate
 * 
 * Este serviço permite enviar dados para um Flow do Power Automate através de um webhook HTTP.
 * 
 * Como configurar:
 * 1. Crie um Flow no Power Automate com um gatilho "Quando uma solicitação HTTP é recebida"
 * 2. Copie a URL do webhook gerada
 * 3. Configure a URL no WebPart ou use a variável de ambiente
 */

export interface IChatMessagePayload {
  message: string;
  user: string;
  timestamp: string;
  respostaAutomatica?: boolean;
  categoria?: string;
  sharePointUrl?: string; // URL para responder no SharePoint
  userId?: string; // ID do usuário para DM
  userEmail?: string; // Email do usuário
}

export interface IProgressoPayload {
  usuario: string;
  etapa: 'primeiroDia' | 'primeiraSemana' | 'primeiroMes';
  tarefasConcluidas: number;
  totalTarefas: number;
  porcentagem: number;
  timestamp: string;
}

export interface IPowerAutomateConfig {
  chatWebhookUrl?: string;
  progressoWebhookUrl?: string;
}

export class PowerAutomateService {
  private config: IPowerAutomateConfig;

  constructor(config?: IPowerAutomateConfig) {
    this.config = config || {
      // URLs padrão - podem ser configuradas via propriedades do WebPart
      chatWebhookUrl: undefined,
      progressoWebhookUrl: undefined
    };
  }

  /**
   * Envia uma mensagem do chat para o Power Automate
   */
  public async enviarMensagemChat(payload: IChatMessagePayload): Promise<boolean> {
    if (!this.config.chatWebhookUrl) {
      console.log('Power Automate: URL do webhook de chat não configurada');
      return false;
    }

    try {
      const response = await fetch(this.config.chatWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mensagem: payload.message,
          usuario: payload.user,
          dataHora: payload.timestamp,
          respostaAutomatica: payload.respostaAutomatica || false,
          categoria: payload.categoria || 'Geral',
          sharePointUrl: payload.sharePointUrl || '',
          userId: payload.userId || '',
          userEmail: payload.userEmail || ''
        })
      });

      if (response.ok) {
        console.log('Power Automate: Mensagem enviada com sucesso');
        return true;
      } else {
        console.error('Power Automate: Erro ao enviar mensagem', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Power Automate: Erro ao enviar mensagem para o webhook:', error);
      return false;
    }
  }

  /**
   * Envia atualização de progresso para o Power Automate
   */
  public async enviarProgresso(payload: IProgressoPayload): Promise<boolean> {
    if (!this.config.progressoWebhookUrl) {
      console.log('Power Automate: URL do webhook de progresso não configurada');
      return false;
    }

    try {
      const response = await fetch(this.config.progressoWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: payload.usuario,
          etapa: payload.etapa,
          tarefasConcluidas: payload.tarefasConcluidas,
          totalTarefas: payload.totalTarefas,
          porcentagem: payload.porcentagem,
          dataHora: payload.timestamp
        })
      });

      if (response.ok) {
        console.log('Power Automate: Progresso enviado com sucesso');
        return true;
      } else {
        console.error('Power Automate: Erro ao enviar progresso', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Power Automate: Erro ao enviar progresso para o webhook:', error);
      return false;
    }
  }

  /**
   * Configura as URLs dos webhooks
   */
  public configurarWebhooks(config: IPowerAutomateConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Verifica se o serviço está configurado
   */
  public estaConfigurado(): boolean {
    return !!(this.config.chatWebhookUrl || this.config.progressoWebhookUrl);
  }
}

