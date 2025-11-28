import { IStorageService } from '../services/IStorageService';

export interface IPrimeiroMesProps {
  onVoltar?: () => void;
  storageService?: IStorageService;
}

