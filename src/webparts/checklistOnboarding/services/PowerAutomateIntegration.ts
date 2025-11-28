/**
 * Utilitário para integração com Power Automate
 * 
 * Este arquivo fornece funções auxiliares para integrar eventos do onboarding
 * com Power Automate Flows através de webhooks HTTP.
 */

import { PowerAutomateService, IProgressoPayload } from './PowerAutomateService';
import { ITarefa } from './IStorageService';

/**
 * Calcula o progresso de uma etapa e envia para Power Automate
 */
export async function enviarProgressoParaPowerAutomate(
  powerAutomateService: PowerAutomateService,
  usuario: string,
  etapa: 'primeiroDia' | 'primeiraSemana' | 'primeiroMes',
  tarefas: ITarefa[]
): Promise<void> {
  if (!powerAutomateService.estaConfigurado()) {
    return;
  }

  let concluidas = 0;
  for (let i = 0; i < tarefas.length; i++) {
    if (tarefas[i].concluida) {
      concluidas++;
    }
  }

  const total = tarefas.length;
  const porcentagem = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const payload: IProgressoPayload = {
    usuario: usuario,
    etapa: etapa,
    tarefasConcluidas: concluidas,
    totalTarefas: total,
    porcentagem: porcentagem,
    timestamp: new Date().toISOString()
  };

  await powerAutomateService.enviarProgresso(payload);
}

