import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../models/score.model';
import { IScoreDatasource } from './score.datasource.interface';

@Injectable()
export class ScoreDatasource implements IScoreDatasource {
    constructor(
        @InjectRepository(Score)
        private _scoreDatabaseRepository: Repository<Score>,
    ) {}

    public async getScoreByUserId(userId: number): Promise<number | null> {
        const foundScore = await this._scoreDatabaseRepository.findOneBy({ userId: userId });
        return foundScore?.score;
    }

    public async upsertScoreForUser(userId: number, score: number): Promise<void> {
        await this._scoreDatabaseRepository.upsert({ userId: userId, score }, ['user_id']);
    }
}
