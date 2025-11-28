import { IPowerAutomateConfig } from '../services/PowerAutomateService';

export interface IChatDuvidasProps {
  userDisplayName: string;
  userId?: string;
  userEmail?: string;
  onVoltar?: () => void;
  powerAutomateConfig?: IPowerAutomateConfig;
}

