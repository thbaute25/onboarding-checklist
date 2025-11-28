export interface IRespostaAutomatica {
  palavrasChave: string[];
  resposta: string;
  categoria: string;
}

export class RespostaAutomaticaService {
  private baseConhecimento: IRespostaAutomatica[] = [
    {
      palavrasChave: ['acesso', 'sistema', 'login', 'senha', 'credencial', 'entrar'],
      resposta: 'Para configurar seu acesso ao sistema, entre em contato com o suporte de TI através do email suporte@empresa.com ou pelo telefone interno 1234. Eles vão te ajudar a configurar suas credenciais.',
      categoria: 'Acesso e Credenciais'
    },
    {
      palavrasChave: ['email', 'outlook', 'correio', 'mensagem'],
      resposta: 'Para configurar seu email corporativo, você pode usar o Outlook. Se precisar de ajuda, entre em contato com o suporte de TI ou consulte o guia de configuração na intranet.',
      categoria: 'Email'
    },
    {
      palavrasChave: ['reunião', 'meeting', 'agendar', 'horário', 'calendário'],
      resposta: 'Para agendar reuniões, use o Outlook Calendar. Você pode ver os horários disponíveis dos seus colegas e agendar reuniões diretamente pelo calendário.',
      categoria: 'Reuniões'
    },
    {
      palavrasChave: ['feriado', 'férias', 'ausência', 'licença', 'folga'],
      resposta: 'Para solicitar férias ou licenças, acesse o sistema de RH através da intranet ou entre em contato com o departamento de Recursos Humanos.',
      categoria: 'Férias e Licenças'
    },
    {
      palavrasChave: ['benefício', 'vale', 'plano', 'saúde', 'seguro'],
      resposta: 'Informações sobre benefícios podem ser encontradas no portal do RH ou entrando em contato diretamente com o departamento de Recursos Humanos.',
      categoria: 'Benefícios'
    },
    {
      palavrasChave: ['salário', 'pagamento', 'holerite', 'contracheque'],
      resposta: 'Informações sobre pagamento e holerites estão disponíveis no portal do RH. Para dúvidas específicas, entre em contato com o departamento financeiro.',
      categoria: 'Pagamento'
    },
    {
      palavrasChave: ['equipe', 'colegas', 'pessoas', 'quem', 'contato'],
      resposta: 'Você pode encontrar informações sobre seus colegas no diretório da empresa ou no Teams. Se precisar de contatos específicos, pergunte ao seu gestor.',
      categoria: 'Equipe'
    },
    {
      palavrasChave: ['documento', 'arquivo', 'onde', 'encontrar', 'localizar'],
      resposta: 'A maioria dos documentos da empresa estão armazenados no SharePoint. Você pode acessar através da intranet ou perguntar ao seu gestor sobre a localização de documentos específicos.',
      categoria: 'Documentos'
    },
    {
      palavrasChave: ['treinamento', 'curso', 'capacitação', 'aprender'],
      resposta: 'Existem vários treinamentos disponíveis. Consulte o portal de treinamentos na intranet ou fale com seu gestor sobre as capacitações recomendadas para sua função.',
      categoria: 'Treinamento'
    },
    {
      palavrasChave: ['wi-fi', 'internet', 'rede', 'conexão', 'wifi'],
      resposta: 'Para configurar o Wi-Fi, procure o suporte de TI. As credenciais de rede geralmente são fornecidas no primeiro dia. Se tiver problemas de conexão, entre em contato com o suporte.',
      categoria: 'Tecnologia'
    },
    {
      palavrasChave: ['escritório', 'local', 'endereço', 'onde', 'ficar'],
      resposta: 'Informações sobre localização do escritório e como chegar estão disponíveis na intranet. Se precisar de direções específicas, entre em contato com a recepção.',
      categoria: 'Localização'
    },
    {
      palavrasChave: ['horário', 'expediente', 'entrada', 'saída', 'jornada'],
      resposta: 'O horário de trabalho padrão é das 9h às 18h, com 1 hora de almoço. Horários flexíveis podem ser acordados com seu gestor. Consulte o manual do funcionário para mais detalhes.',
      categoria: 'Horários'
    }
  ];

  /**
   * Analisa a mensagem do usuário e retorna uma resposta automática se encontrar correspondência
   */
  public obterResposta(mensagem: string): string | undefined {
    const mensagemLower = mensagem.toLowerCase().trim();
    
    // Remover pontuação e caracteres especiais para melhor matching
    const mensagemLimpa = mensagemLower
      .replace(/[.,!?;:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Procurar correspondência por palavras-chave
    for (const item of this.baseConhecimento) {
      let palavrasEncontradas = 0;
      for (let i = 0; i < item.palavrasChave.length; i++) {
        const palavra = item.palavrasChave[i].toLowerCase();
        if (mensagemLimpa.indexOf(palavra) !== -1) {
          palavrasEncontradas++;
        }
      }

      // Se encontrar pelo menos uma palavra-chave relevante, retorna a resposta
      if (palavrasEncontradas > 0) {
        return item.resposta;
      }
    }

    // Se não encontrar correspondência, retorna undefined
    return undefined;
  }

  /**
   * Retorna uma resposta padrão quando não há correspondência
   */
  public obterRespostaPadrao(): string {
    return 'Obrigado pela sua dúvida! Nossa equipe vai analisar e responder em breve. Enquanto isso, você pode consultar o manual do funcionário na intranet ou entrar em contato com seu gestor.';
  }

  /**
   * Adiciona uma nova resposta automática à base de conhecimento
   */
  public adicionarResposta(palavrasChave: string[], resposta: string, categoria: string): void {
    this.baseConhecimento.push({
      palavrasChave,
      resposta,
      categoria
    });
  }

  /**
   * Retorna todas as categorias disponíveis
   */
  public obterCategorias(): string[] {
    const categoriasSet: { [key: string]: boolean } = {};
    const categorias: string[] = [];
    
    for (let i = 0; i < this.baseConhecimento.length; i++) {
      const categoria = this.baseConhecimento[i].categoria;
      if (!categoriasSet[categoria]) {
        categoriasSet[categoria] = true;
        categorias.push(categoria);
      }
    }
    
    return categorias;
  }
}

