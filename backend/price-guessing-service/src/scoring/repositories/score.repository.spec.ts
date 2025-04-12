import { IScoreDatasource } from '../datasources/score.datasource.interface';
import { ScoreRepository } from './score.repository';
import { IScoreRepository } from './score.repository.interface';

describe('ScoreRepository', () => {
    let repository: IScoreRepository;
    let mockDatasource: jest.Mocked<IScoreDatasource>;

    beforeEach(() => {
        mockDatasource = {
            getScoreByUserId: jest.fn(),
            upsertScoreForUser: jest.fn(),
        } as unknown as jest.Mocked<IScoreDatasource>;
        repository = new ScoreRepository(mockDatasource);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('getScoreByUserId', () => {
        it('should call getScoreByUserId from the datasource', async () => {
            const userId = 1;
            const result = await repository.getScoreByUserId(userId);
            expect(mockDatasource.getScoreByUserId).toHaveBeenCalledWith(userId);
            expect(result).toBeUndefined();
        });

        it('should return the score from the datasource', async () => {
            const userId = 1;
            const score = 100;
            mockDatasource.getScoreByUserId.mockResolvedValue(score);
            const result = await repository.getScoreByUserId(userId);
            expect(result).toBe(score);
        });
    });

    describe('upsertScoreForUser', () => {
        it('should call upsertScoreForUser from the datasource', async () => {
            const userId = 1;
            const score = 100;
            await repository.upsertScoreForUser(userId, score);
            expect(mockDatasource.upsertScoreForUser).toHaveBeenCalledWith(userId, score);
        });
    });
});
