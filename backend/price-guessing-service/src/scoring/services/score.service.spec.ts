import { IScoreRepository } from '../repositories/score.repository.interface';
import { ScoreService } from './score.service';
import { IScoreService } from './score.service.interface';

describe('ScoreService', () => {
    let service: IScoreService;
    let mockRepository: jest.Mocked<IScoreRepository>;

    const userId = 1;
    const score = 100;

    beforeEach(() => {
        mockRepository = {
            getScoreByUserId: jest.fn(),
            upsertScoreForUser: jest.fn(),
        } as unknown as jest.Mocked<IScoreRepository>;
        service = new ScoreService(mockRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('getOrInitializeScoreByUserId', () => {
        it('should call getScoreByUserId from the repository', async () => {
            await service.getOrInitializeScoreByUserId(userId);
            expect(mockRepository.getScoreByUserId).toHaveBeenCalledWith(userId);
        });

        describe('When no score is found', () => {
            beforeEach(() => {
                mockRepository.getScoreByUserId.mockResolvedValue(undefined);
            });

            it('should call upsertScoreForUser from the repository with default score (0)', async () => {
                await service.getOrInitializeScoreByUserId(userId);
                expect(mockRepository.upsertScoreForUser).toHaveBeenCalledWith(userId, 0);
            });

            it('should return 0', async () => {
                const result = await service.getOrInitializeScoreByUserId(userId);
                expect(result).toBe(0);
            });
        });

        describe('When existing user score is found', () => {
            beforeEach(() => {
                mockRepository.getScoreByUserId.mockResolvedValue(score);
            });

            it('should not call upsertScoreForUser from the repository', async () => {
                await service.getOrInitializeScoreByUserId(userId);
                expect(mockRepository.upsertScoreForUser).not.toHaveBeenCalled();
            });

            it('should return the score', async () => {
                const result = await service.getOrInitializeScoreByUserId(userId);
                expect(result).toBe(score);
            });
        });
    });
});
