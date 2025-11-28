import { IStorageService } from '../services/IStorageService';

export interface ITarefasProps {
  onSelectStage: (stage: string) => void;
  onVoltar?: () => void;
  storageService?: IStorageService;
}

