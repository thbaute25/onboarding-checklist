import { IStorageService } from '../services/IStorageService';

export interface IPrimeiroDiaProps {
  onVoltar?: () => void;
  storageService?: IStorageService;
}

