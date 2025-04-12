import { GuessTypeEnum } from '../dtos/guess.dto';
import { GuessEntity } from '../entities/guess.entity';
import { IGuessRepository } from '../repositories/guess.repository.interface';
import { GuessService } from './guess.service';
import { IGuessService } from './guess.service.interface';

describe('GuessService', () => {
    let service: IGuessService;
    let mockRepository: jest.Mocked<IGuessRepository>;

    const userId = 1;
    const guess = GuessTypeEnum.DOWN;
    const currentPrice = 100;
    const placedGuess = new GuessEntity();

    beforeEach(() => {
        mockRepository = {
            findUnresolvedGuessByUserId: jest.fn(),
            createGuess: jest.fn(),
        } as unknown as jest.Mocked<IGuessRepository>;

        service = new GuessService(mockRepository);

        placedGuess.isPlaced = true;
        placedGuess.placedAt = new Date();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('placeGuess', () => {
        it('should check if there is already an unresolved guess for this user', async () => {
            await service.placeGuess(userId, guess, currentPrice);

            expect(mockRepository.findUnresolvedGuessByUserId).toHaveBeenCalledWith(userId);
        });

        describe('When no previous unresolved guess is found', () => {
            beforeEach(() => {
                mockRepository.findUnresolvedGuessByUserId.mockResolvedValue(null);
                mockRepository.createGuess.mockResolvedValue(placedGuess);
            });

            it('should call createGuess from the repository', async () => {
                await service.placeGuess(userId, guess, currentPrice);

                expect(mockRepository.createGuess).toHaveBeenCalledWith(userId, guess, currentPrice);
            });

            it('should return the placed guess', async () => {
                const result = await service.placeGuess(userId, guess, currentPrice);

                expect(result).toBe(placedGuess);
            });
        });

        describe('When a previous unresolved guess is found', () => {
            beforeEach(() => {
                mockRepository.findUnresolvedGuessByUserId.mockResolvedValue(placedGuess);
            });

            it('should throw', async () => {
                await expect(service.placeGuess(userId, guess, currentPrice)).rejects.toThrow(
                    'There is already one guess placed that must still be resolved',
                );

                expect(mockRepository.createGuess).not.toHaveBeenCalled();
            });
        });
    });
});
