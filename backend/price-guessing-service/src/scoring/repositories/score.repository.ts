import { Inject, Injectable } from '@nestjs/common';
import { ScoreDatasource } from '../datasources/score.datasource';
import { IScoreDatasource } from '../datasources/score.datasource.interface';
import { IScoreRepository } from './score.repository.interface';

@Injectable()
export class ScoreRepository implements IScoreRepository {
    constructor(
        @Inject(ScoreDatasource)
        private readonly _scoreDatasource: IScoreDatasource,
    ) {}

    async getScoreByUserId(userId: number): Promise<number | undefined> {
        const result = await this._scoreDatasource.getScoreByUserId(userId);

        if (result === null || result === undefined) {
            return undefined;
        }

        return result;
    }
    async upsertScoreForUser(userId: number, score: number): Promise<void> {
        await this._scoreDatasource.upsertScoreForUser(userId, score);
    }
}
