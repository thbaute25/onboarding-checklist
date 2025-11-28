import { IStorageService } from '../services/IStorageService';

export interface IPrimeiraSemanaProps {
  onVoltar?: () => void;
  storageService?: IStorageService;
}

