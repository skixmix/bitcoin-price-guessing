import { Repository } from 'typeorm';
import { Score } from '../models/score.model';
import { ScoreDatasource } from './score.datasource';
import { IScoreDatasource } from './score.datasource.interface';

describe('ScoreDatasource', () => {
    let datasource: IScoreDatasource;
    let mockScoreDatabaseRepository: jest.Mocked<Repository<Score>>;

    beforeEach(() => {
        mockScoreDatabaseRepository = {
            findOneBy: jest.fn(),
            upsert: jest.fn(),
        } as unknown as jest.Mocked<Repository<Score>>;

        datasource = new ScoreDatasource(mockScoreDatabaseRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('upsertScoreForUser', () => {
        it('should call upsert from the repository', async () => {
            const userId = 1;
            const score = 100;
            await datasource.upsertScoreForUser(userId, score);
            expect(mockScoreDatabaseRepository.upsert).toHaveBeenCalledWith({ userId: userId, score }, ['userId']);
        });
    });

    describe('getScoreByUserId', () => {
        it('should call findOneBy from the repository', async () => {
            const userId = 1;
            await datasource.getScoreByUserId(userId);
            expect(mockScoreDatabaseRepository.findOneBy).toHaveBeenCalledWith({ userId: userId });
        });
    });
});
