import { ScoreService } from './score.service';
import { IScoreService } from './score.service.interface';

export const scoreServiceInstance: IScoreService = new ScoreService();
