import { Inject, Injectable } from '@nestjs/common';
import { ScoreRepository } from '../repositories/score.repository';
import { IScoreRepository } from '../repositories/score.repository.interface';
import { IScoreService } from './score.service.interface';

@Injectable()
export class ScoreService implements IScoreService {
    private readonly _DEFAULT_SCORE = 0;

    constructor(
        @Inject(ScoreRepository)
        private readonly scoreRepository: IScoreRepository,
    ) {}

    async getOrInitializeScoreByUserId(userId: number): Promise<number> {
        const score = await this.scoreRepository.getScoreByUserId(userId);
        if (score === undefined) {
            await this.scoreRepository.upsertScoreForUser(userId, this._DEFAULT_SCORE);
            return this._DEFAULT_SCORE;
        }
        return score;
    }
}
