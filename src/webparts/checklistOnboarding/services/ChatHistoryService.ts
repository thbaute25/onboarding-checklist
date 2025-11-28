export interface IChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

export interface IChatSession {
  id: string;
  messages: IChatMessage[];
  createdAt: Date;
  lastMessageAt: Date;
}

export class ChatHistoryService {
  private readonly STORAGE_KEY = 'onboarding-chat-history';

  /**
   * Salva uma mensagem no histórico
   */
  public salvarMensagem(mensagem: IChatMessage): void {
    try {
      const historico = this.carregarHistorico();
      const sessaoAtual = this.obterSessaoAtual(historico);

      // Converter Date para string para serialização
      const mensagemSerializada = {
        ...mensagem,
        timestamp: mensagem.timestamp.toISOString()
      };

      sessaoAtual.messages.push({
        id: mensagem.id,
        text: mensagem.text,
        sender: mensagem.sender,
        timestamp: new Date(mensagemSerializada.timestamp)
      });
      sessaoAtual.lastMessageAt = new Date();

      this.salvarHistorico(historico);
    } catch (error) {
      console.error('Erro ao salvar mensagem no histórico:', error);
    }
  }

  /**
   * Salva múltiplas mensagens de uma vez
   */
  public salvarMensagens(mensagens: IChatMessage[]): void {
    try {
      const historico = this.carregarHistorico();
      const sessaoAtual = this.obterSessaoAtual(historico);

      const mensagensSerializadas = mensagens.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }));

      for (let i = 0; i < mensagensSerializadas.length; i++) {
        const msg = mensagensSerializadas[i];
        sessaoAtual.messages.push({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp)
        });
      }
      sessaoAtual.lastMessageAt = new Date();

      this.salvarHistorico(historico);
    } catch (error) {
      console.error('Erro ao salvar mensagens no histórico:', error);
    }
  }

  /**
   * Carrega o histórico de conversas
   */
  public carregarHistorico(): IChatSession[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const historicoRaw = JSON.parse(data) as Array<{
          id: string;
          createdAt: string;
          lastMessageAt: string;
          messages: Array<{
            id: string;
            text: string;
            sender: 'user' | 'system';
            timestamp: string;
          }>;
        }>;
        // Converter strings de data de volta para Date
        const historico: IChatSession[] = [];
        for (let i = 0; i < historicoRaw.length; i++) {
          const sessaoRaw = historicoRaw[i];
          historico.push({
            id: sessaoRaw.id,
            createdAt: new Date(sessaoRaw.createdAt),
            lastMessageAt: new Date(sessaoRaw.lastMessageAt),
            messages: sessaoRaw.messages.map((msg) => ({
              id: msg.id,
              text: msg.text,
              sender: msg.sender,
              timestamp: new Date(msg.timestamp)
            }))
          });
        }
        return historico;
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
    return [];
  }

  /**
   * Carrega mensagens da sessão atual
   */
  public carregarMensagensSessaoAtual(): IChatMessage[] {
    const historico = this.carregarHistorico();
    const sessaoAtual = this.obterSessaoAtual(historico);
    return sessaoAtual.messages;
  }

  /**
   * Obtém ou cria a sessão atual
   */
  private obterSessaoAtual(historico: IChatSession[]): IChatSession {
    // Usar data atual como identificador de sessão (uma sessão por dia)
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const dia = hoje.getDate();
    const mesStr = mes < 10 ? '0' + mes : String(mes);
    const diaStr = dia < 10 ? '0' + dia : String(dia);
    const hojeStr = ano + '-' + mesStr + '-' + diaStr; // YYYY-MM-DD

    let sessaoAtual: IChatSession | undefined;
    for (let i = 0; i < historico.length; i++) {
      if (historico[i].id === hojeStr) {
        sessaoAtual = historico[i];
        break;
      }
    }

    if (!sessaoAtual) {
      sessaoAtual = {
        id: hojeStr,
        messages: [],
        createdAt: hoje,
        lastMessageAt: hoje
      };
      historico.push(sessaoAtual);
    }

    return sessaoAtual;
  }

  /**
   * Salva o histórico completo
   */
  private salvarHistorico(historico: IChatSession[]): void {
    try {
      // Manter apenas as últimas 30 sessões
      const historicoLimitado = historico
        .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
        .slice(0, 30);

      // Serializar datas para string
      const historicoSerializado = historicoLimitado.map(sessao => ({
        ...sessao,
        createdAt: sessao.createdAt.toISOString(),
        lastMessageAt: sessao.lastMessageAt.toISOString(),
        messages: sessao.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }))
      }));

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(historicoSerializado));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  }

  /**
   * Limpa todo o histórico
   */
  public limparHistorico(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }

  /**
   * Obtém todas as sessões de conversa
   */
  public obterSessoes(): IChatSession[] {
    return this.carregarHistorico().sort(
      (a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
    );
  }

  /**
   * Obtém mensagens de uma sessão específica
   */
  public obterMensagensSessao(sessaoId: string): IChatMessage[] {
    const historico = this.carregarHistorico();
    let sessao: IChatSession | undefined;
    for (let i = 0; i < historico.length; i++) {
      if (historico[i].id === sessaoId) {
        sessao = historico[i];
        break;
      }
    }
    return sessao ? sessao.messages : [];
  }
}

