import { GuessingService } from './guessing.service';
import { IGuessingService } from './guessing.service.interface';

export const guessingServiceInstance: IGuessingService = new GuessingService();
