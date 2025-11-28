import { ChatHistoryService, IChatSession, IChatMessage } from './ChatHistoryService';
import { RespostaAutomaticaService } from './RespostaAutomaticaService';

export interface IEstatisticaCategoria {
  categoria: string;
  quantidade: number;
  porcentagem: number;
}

export interface IDuvidaComum {
  texto: string;
  quantidade: number;
  categoria: string;
}

export interface ITempoResposta {
  tempoMedio: number; // em minutos
  tempoMedioFormatado: string;
  totalRespostas: number;
}

export interface IDashboardData {
  totalDuvidas: number;
  totalUsuarios: number;
  duvidasPorCategoria: IEstatisticaCategoria[];
  duvidasMaisComuns: IDuvidaComum[];
  tempoMedioResposta: ITempoResposta;
  duvidasPorDia: Array<{ data: string; quantidade: number }>;
  categoriaComMaisDor: string;
}

export class DashboardService {
  private chatHistoryService: ChatHistoryService;
  private respostaService: RespostaAutomaticaService;

  constructor() {
    this.chatHistoryService = new ChatHistoryService();
    this.respostaService = new RespostaAutomaticaService();
  }

  /**
   * Calcula todas as estatísticas do dashboard
   */
  public calcularEstatisticas(): IDashboardData {
    const sessoes = this.chatHistoryService.obterSessoes();
    const todasMensagens: IChatMessage[] = [];

    // Coletar todas as mensagens de todas as sessões
    for (let i = 0; i < sessoes.length; i++) {
      const sessao = sessoes[i];
      for (let j = 0; j < sessao.messages.length; j++) {
        todasMensagens.push(sessao.messages[j]);
      }
    }

    // Filtrar apenas mensagens de usuários (dúvidas)
    const duvidas = todasMensagens.filter(msg => msg.sender === 'user');

    // Calcular estatísticas
    const duvidasPorCategoria = this.calcularDuvidasPorCategoria(duvidas);
    const duvidasMaisComuns = this.calcularDuvidasMaisComuns(duvidas);
    const tempoMedioResposta = this.calcularTempoMedioResposta(sessoes);
    const duvidasPorDia = this.calcularDuvidasPorDia(sessoes);
    const usuariosUnicos = this.obterUsuariosUnicos(sessoes);
    const categoriaComMaisDor = this.obterCategoriaComMaisDor(duvidasPorCategoria);

    return {
      totalDuvidas: duvidas.length,
      totalUsuarios: usuariosUnicos.length,
      duvidasPorCategoria: duvidasPorCategoria,
      duvidasMaisComuns: duvidasMaisComuns,
      tempoMedioResposta: tempoMedioResposta,
      duvidasPorDia: duvidasPorDia,
      categoriaComMaisDor: categoriaComMaisDor
    };
  }

  /**
   * Calcula quantidade de dúvidas por categoria
   */
  private calcularDuvidasPorCategoria(duvidas: IChatMessage[]): IEstatisticaCategoria[] {
    const categoriasMap: { [key: string]: number } = {};
    const total = duvidas.length;

    // Classificar cada dúvida por categoria
    for (let i = 0; i < duvidas.length; i++) {
      const duvida = duvidas[i];
      const categoria = this.respostaService.obterResposta(duvida.text);
      const categoriaNome = categoria ? this.obterCategoriaDaResposta(duvida.text) : 'Geral';
      
      if (!categoriasMap[categoriaNome]) {
        categoriasMap[categoriaNome] = 0;
      }
      categoriasMap[categoriaNome]++;
    }

    // Converter para array e calcular porcentagens
    const resultado: IEstatisticaCategoria[] = [];
    for (const categoria in categoriasMap) {
      if (Object.prototype.hasOwnProperty.call(categoriasMap, categoria)) {
        resultado.push({
          categoria: categoria,
          quantidade: categoriasMap[categoria],
          porcentagem: total > 0 ? Math.round((categoriasMap[categoria] / total) * 100) : 0
        });
      }
    }

    // Ordenar por quantidade (maior primeiro)
    resultado.sort((a, b) => b.quantidade - a.quantidade);

    return resultado;
  }

  /**
   * Obtém a categoria de uma dúvida baseado na resposta automática
   */
  private obterCategoriaDaResposta(texto: string): string {
    // Processar texto da mesma forma que RespostaAutomaticaService
    const textoLower = texto.toLowerCase().trim();
    const textoLimpo = textoLower.replace(/[.,!?;:]/g, ' ').replace(/\s+/g, ' ').trim();

    // Lista de categorias e palavras-chave (baseado no RespostaAutomaticaService)
    const categoriasMap: Array<{ categoria: string; palavrasChave: string[] }> = [
      { categoria: 'Acesso e Credenciais', palavrasChave: ['acesso', 'sistema', 'login', 'senha', 'credencial', 'entrar'] },
      { categoria: 'Email', palavrasChave: ['email', 'outlook', 'correio', 'mensagem'] },
      { categoria: 'Reuniões', palavrasChave: ['reunião', 'meeting', 'agendar', 'horário', 'calendário'] },
      { categoria: 'Férias e Licenças', palavrasChave: ['feriado', 'férias', 'ausência', 'licença', 'folga'] },
      { categoria: 'Benefícios', palavrasChave: ['benefício', 'vale', 'plano', 'saúde', 'seguro'] },
      { categoria: 'Pagamento', palavrasChave: ['salário', 'pagamento', 'holerite', 'contracheque'] },
      { categoria: 'Equipe', palavrasChave: ['equipe', 'colegas', 'pessoas', 'quem', 'contato'] },
      { categoria: 'Documentos', palavrasChave: ['documento', 'arquivo', 'onde', 'encontrar', 'localizar'] },
      { categoria: 'Treinamento', palavrasChave: ['treinamento', 'curso', 'capacitação', 'aprender'] },
      { categoria: 'Tecnologia', palavrasChave: ['wi-fi', 'internet', 'rede', 'conexão', 'wifi'] },
      { categoria: 'Localização', palavrasChave: ['escritório', 'local', 'endereço', 'onde', 'ficar'] },
      { categoria: 'Horários', palavrasChave: ['horário', 'expediente', 'entrada', 'saída', 'jornada'] }
    ];

    // Procurar categoria correspondente
    for (let i = 0; i < categoriasMap.length; i++) {
      const item = categoriasMap[i];
      for (let j = 0; j < item.palavrasChave.length; j++) {
        if (textoLimpo.indexOf(item.palavrasChave[j].toLowerCase()) !== -1) {
          return item.categoria;
        }
      }
    }

    return 'Geral';
  }

  /**
   * Calcula as dúvidas mais comuns
   */
  private calcularDuvidasMaisComuns(duvidas: IChatMessage[]): IDuvidaComum[] {
    const duvidasMap: { [key: string]: { texto: string; quantidade: number; categoria: string } } = {};

    // Agrupar dúvidas similares (normalizar texto)
    for (let i = 0; i < duvidas.length; i++) {
      const duvida = duvidas[i];
      const textoNormalizado = duvida.text.toLowerCase().trim();
      
      // Procurar dúvida similar existente
      let encontrada = false;
      for (const key in duvidasMap) {
        if (Object.prototype.hasOwnProperty.call(duvidasMap, key)) {
          const similaridade = this.calcularSimilaridade(textoNormalizado, key.toLowerCase());
          if (similaridade > 0.7) { // 70% de similaridade
            duvidasMap[key].quantidade++;
            encontrada = true;
            break;
          }
        }
      }

      if (!encontrada) {
        const categoria = this.obterCategoriaDaResposta(duvida.text);
        duvidasMap[textoNormalizado] = {
          texto: duvida.text,
          quantidade: 1,
          categoria: categoria
        };
      }
    }

    // Converter para array e ordenar
    const resultado: IDuvidaComum[] = [];
    for (const key in duvidasMap) {
      if (Object.prototype.hasOwnProperty.call(duvidasMap, key)) {
        resultado.push(duvidasMap[key]);
      }
    }

    resultado.sort((a, b) => b.quantidade - a.quantidade);
    return resultado.slice(0, 10); // Top 10
  }

  /**
   * Calcula similaridade simples entre duas strings
   */
  private calcularSimilaridade(str1: string, str2: string): number {
    const palavras1 = str1.split(' ');
    const palavras2 = str2.split(' ');
    let palavrasComuns = 0;

    for (let i = 0; i < palavras1.length; i++) {
      for (let j = 0; j < palavras2.length; j++) {
        if (palavras1[i] === palavras2[j] && palavras1[i].length > 3) {
          palavrasComuns++;
          break;
        }
      }
    }

    const totalPalavras = Math.max(palavras1.length, palavras2.length);
    return totalPalavras > 0 ? palavrasComuns / totalPalavras : 0;
  }

  /**
   * Calcula tempo médio de resposta
   */
  private calcularTempoMedioResposta(sessoes: IChatSession[]): ITempoResposta {
    const temposResposta: number[] = [];

    for (let i = 0; i < sessoes.length; i++) {
      const sessao = sessoes[i];
      const mensagens = sessao.messages;

      for (let j = 0; j < mensagens.length - 1; j++) {
        if (mensagens[j].sender === 'user' && mensagens[j + 1].sender === 'system') {
          const tempoResposta = mensagens[j + 1].timestamp.getTime() - mensagens[j].timestamp.getTime();
          const minutos = tempoResposta / (1000 * 60);
          if (minutos > 0 && minutos < 1440) { // Menos de 24 horas
            temposResposta.push(minutos);
          }
        }
      }
    }

    if (temposResposta.length === 0) {
      return {
        tempoMedio: 0,
        tempoMedioFormatado: 'N/A',
        totalRespostas: 0
      };
    }

    let soma = 0;
    for (let i = 0; i < temposResposta.length; i++) {
      soma += temposResposta[i];
    }

    const tempoMedio = soma / temposResposta.length;
    const horas = Math.floor(tempoMedio / 60);
    const minutos = Math.round(tempoMedio % 60);

    let tempoFormatado = '';
    if (horas > 0) {
      tempoFormatado = horas + 'h ' + minutos + 'min';
    } else {
      tempoFormatado = minutos + 'min';
    }

    return {
      tempoMedio: tempoMedio,
      tempoMedioFormatado: tempoFormatado,
      totalRespostas: temposResposta.length
    };
  }

  /**
   * Calcula dúvidas por dia
   */
  private calcularDuvidasPorDia(sessoes: IChatSession[]): Array<{ data: string; quantidade: number }> {
    const duvidasPorDiaMap: { [key: string]: number } = {};

    for (let i = 0; i < sessoes.length; i++) {
      const sessao = sessoes[i];
      const dataStr = this.formatarData(sessao.lastMessageAt);
      const duvidasDia = sessao.messages.filter(msg => msg.sender === 'user').length;

      if (!duvidasPorDiaMap[dataStr]) {
        duvidasPorDiaMap[dataStr] = 0;
      }
      duvidasPorDiaMap[dataStr] += duvidasDia;
    }

    const resultado: Array<{ data: string; quantidade: number }> = [];
    for (const data in duvidasPorDiaMap) {
      if (Object.prototype.hasOwnProperty.call(duvidasPorDiaMap, data)) {
        resultado.push({
          data: data,
          quantidade: duvidasPorDiaMap[data]
        });
      }
    }

    // Ordenar por data (mais recente primeiro)
    resultado.sort((a, b) => {
      const dataA = new Date(a.data.split('/').reverse().join('-'));
      const dataB = new Date(b.data.split('/').reverse().join('-'));
      return dataB.getTime() - dataA.getTime();
    });

    return resultado.slice(0, 30); // Últimos 30 dias
  }

  /**
   * Formata data para exibição
   */
  private formatarData(data: Date): string {
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    const diaStr = dia < 10 ? '0' + dia : String(dia);
    const mesStr = mes < 10 ? '0' + mes : String(mes);
    return diaStr + '/' + mesStr + '/' + ano;
  }

  /**
   * Obtém lista de usuários únicos
   */
  private obterUsuariosUnicos(sessoes: IChatSession[]): string[] {
    const usuariosMap: { [key: string]: boolean } = {};
    const usuarios: string[] = [];

    // Assumindo que cada sessão é de um usuário diferente
    // Em produção, você pode ter um campo userId nas mensagens
    for (let i = 0; i < sessoes.length; i++) {
      if (sessoes[i].messages.length > 0) {
        const sessaoId = sessoes[i].id;
        if (!usuariosMap[sessaoId]) {
          usuariosMap[sessaoId] = true;
          usuarios.push('Usuário ' + (i + 1));
        }
      }
    }

    return usuarios;
  }

  /**
   * Obtém categoria com mais "dor" (mais dúvidas)
   */
  private obterCategoriaComMaisDor(categorias: IEstatisticaCategoria[]): string {
    if (categorias.length === 0) {
      return 'Nenhuma';
    }

    return categorias[0].categoria; // Já está ordenado por quantidade
  }
}

