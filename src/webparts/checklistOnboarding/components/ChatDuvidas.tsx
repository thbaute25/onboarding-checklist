import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from './ChatDuvidas.module.scss';
import type { IChatDuvidasProps } from './IChatDuvidasProps';
import { RespostaAutomaticaService } from '../services/RespostaAutomaticaService';
import { ChatHistoryService, IChatMessage, IChatSession } from '../services/ChatHistoryService';
import { PowerAutomateService } from '../services/PowerAutomateService';

interface IMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

// Criar instâncias dos serviços fora do componente para evitar recriações
const respostaService = new RespostaAutomaticaService();
const historyService = new ChatHistoryService();

const ChatDuvidas: React.FC<IChatDuvidasProps> = (props: IChatDuvidasProps): React.ReactElement<IChatDuvidasProps> => {
  // Criar instância do Power Automate Service com configuração das props
  const powerAutomateService = React.useMemo(() => {
    const service = new PowerAutomateService();
    if (props.powerAutomateConfig) {
      service.configurarWebhooks(props.powerAutomateConfig);
    }
    return service;
  }, [props.powerAutomateConfig]);
  
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [mostrarHistorico, setMostrarHistorico] = useState<boolean>(false);
  const [sessoes, setSessoes] = useState<IChatSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const mensagensSalvasRef = useRef<boolean>(false);

  // Carregar histórico ao montar o componente
  useEffect(() => {
    const mensagensSalvas = historyService.carregarMensagensSessaoAtual();
    
    if (mensagensSalvas.length > 0) {
      // Converter IChatMessage para IMessage
      const mensagensConvertidas: IMessage[] = mensagensSalvas.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp
      }));
      setMessages(mensagensConvertidas);
      mensagensSalvasRef.current = true;
    } else {
      // Mensagem inicial apenas se não houver histórico
      setMessages([
        {
          id: '1',
          text: 'Olá! Como posso ajudá-lo hoje?',
          sender: 'system',
          timestamp: new Date()
        }
      ]);
    }

    // Carregar lista de sessões para o histórico
    setSessoes(historyService.obterSessoes());
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (msg: string): Promise<void> => {
    if (!msg.trim() || isSending) {
      return;
    }

    const userMessage: IMessage = {
      id: Date.now().toString(),
      text: msg.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    // Adicionar mensagem do usuário imediatamente
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    // Tentar obter resposta automática
    const respostaAutomatica = respostaService.obterResposta(msg.trim());
    const respostaTexto = respostaAutomatica || respostaService.obterRespostaPadrao();

    // Debug: log para verificar se a resposta está sendo gerada
    console.log('Mensagem recebida:', msg.trim());
    console.log('Resposta automática encontrada:', respostaAutomatica !== undefined);
    console.log('Texto da resposta:', respostaTexto);

    // Simular delay para resposta mais natural (500ms - reduzido para teste)
    window.setTimeout(() => {
      const respostaMessage: IMessage = {
        id: `resposta-${Date.now()}-${Math.random()}`,
        text: respostaTexto,
        sender: 'system',
        timestamp: new Date()
      };

      console.log('Adicionando resposta ao estado:', respostaMessage);
      setMessages(prev => {
        const novasMensagens = [...prev, respostaMessage];
        console.log('Total de mensagens:', novasMensagens.length);
        
        // Salvar ambas as mensagens (usuário + resposta) no histórico
        const mensagensParaSalvar: IChatMessage[] = [
          {
            id: userMessage.id,
            text: userMessage.text,
            sender: userMessage.sender,
            timestamp: userMessage.timestamp
          },
          {
            id: respostaMessage.id,
            text: respostaMessage.text,
            sender: respostaMessage.sender,
            timestamp: respostaMessage.timestamp
          }
        ];
        historyService.salvarMensagens(mensagensParaSalvar);
        
        return novasMensagens;
      });
      setIsSending(false);
    }, 500);

    // Armazenar timeoutId para possível limpeza (opcional)
    // O timeout será executado normalmente mesmo se o componente for desmontado

    // Enviar para o Power Automate em background
    // Não bloqueia a resposta automática
    const categoria = respostaAutomatica ? 'Resposta Automática' : 'Dúvida Nova';
    
    // Construir URL do SharePoint para resposta
    const sharePointUrl = window.location.href.split('?')[0]; // URL atual sem parâmetros
    
    powerAutomateService.enviarMensagemChat({
      message: msg.trim(),
      user: props.userDisplayName,
      timestamp: new Date().toISOString(),
      respostaAutomatica: respostaAutomatica !== undefined,
      categoria: categoria,
      sharePointUrl: sharePointUrl,
      userId: props.userId || '',
      userEmail: props.userEmail || ''
    }).catch(() => {
      // Silenciosamente falha se o Power Automate não estiver configurado
      // Isso não afeta a experiência do usuário, pois a resposta automática já foi mostrada
    });
  };

  const handleSend = (): void => {
    sendMessage(inputValue).catch((error) => {
      console.error('Erro ao enviar mensagem:', error);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleHistorico = (): void => {
    setMostrarHistorico(!mostrarHistorico);
    if (!mostrarHistorico) {
      setSessoes(historyService.obterSessoes());
    }
  };

  const carregarSessao = (sessaoId: string): void => {
    const mensagensSessao = historyService.obterMensagensSessao(sessaoId);
    const mensagensConvertidas: IMessage[] = mensagensSessao.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender,
      timestamp: msg.timestamp
    }));
    setMessages(mensagensConvertidas);
    setMostrarHistorico(false);
  };

  const formatarDataSessao = (data: Date): string => {
    const hoje = new Date();
    const ontem = new Date(hoje.getTime());
    ontem.setDate(ontem.getDate() - 1);

    const hojeStr = hoje.toDateString();
    const ontemStr = ontem.toDateString();
    const dataStr = data.toDateString();

    if (dataStr === hojeStr) {
      return 'Hoje';
    } else if (dataStr === ontemStr) {
      return 'Ontem';
    } else {
      const dia = data.getDate();
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();
      const diaStr = dia < 10 ? '0' + dia : String(dia);
      const mesStr = mes < 10 ? '0' + mes : String(mes);
      return diaStr + '/' + mesStr + '/' + ano;
    }
  };

  return (
    <section className={styles.chatDuvidas}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.titulo}>Dúvidas</h1>
              <p className={styles.subtitulo}>Envie suas dúvidas durante o onboarding</p>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.botaoHistorico}
                onClick={toggleHistorico}
                title="Ver histórico de conversas"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                </svg>
                Histórico
              </button>
              {props.onVoltar && (
                <button 
                  className={styles.botaoVoltar}
                  onClick={props.onVoltar}
                >
                  ← Voltar
                </button>
              )}
            </div>
          </div>
        </div>

        {mostrarHistorico && (
          <div className={styles.historicoOverlay} onClick={toggleHistorico}>
            <div className={styles.historicoPanel} onClick={(e) => e.stopPropagation()}>
              <div className={styles.historicoHeader}>
                <h2 className={styles.historicoTitulo}>Histórico de Conversas</h2>
                <button
                  className={styles.botaoFechar}
                  onClick={toggleHistorico}
                  aria-label="Fechar histórico"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className={styles.historicoLista}>
                {sessoes.length === 0 ? (
                  <div className={styles.historicoVazio}>
                    <p>Nenhuma conversa anterior encontrada.</p>
                  </div>
                ) : (
                  sessoes.map((sessao) => (
                    <div
                      key={sessao.id}
                      className={styles.historicoItem}
                      onClick={() => carregarSessao(sessao.id)}
                    >
                      <div className={styles.historicoItemHeader}>
                        <span className={styles.historicoData}>
                          {formatarDataSessao(sessao.lastMessageAt)}
                        </span>
                        <span className={styles.historicoContador}>
                          {sessao.messages.length} mensagem{sessao.messages.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {sessao.messages.length > 0 && (
                        <p className={styles.historicoPreview}>
                          {sessao.messages[sessao.messages.length - 1].text.substring(0, 60)}
                          {sessao.messages[sessao.messages.length - 1].text.length > 60 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageBubble} ${message.sender === 'user' ? styles.userMessage : styles.systemMessage}`}
            >
              <div className={styles.messageContent}>
                <p className={styles.messageText}>{message.text}</p>
                <span className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.messageInput}
            placeholder="Digite sua dúvida..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            aria-label="Enviar mensagem"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatDuvidas;

