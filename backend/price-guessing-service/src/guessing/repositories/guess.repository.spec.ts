import { IGuessDataSource } from '../datasources/guess.datasource.interface';
import { GuessTypeEnum } from '../dtos/guess.dto';
import { GuessEntity, IGuessEntity } from '../entities/guess.entity';
import { Guess } from '../models/guess.model';
import { GuessRepository } from './guess.repository';
import { IGuessRepository } from './guess.repository.interface';

describe('GuessRepository', () => {
    let repository: IGuessRepository;
    let mockDatasource: jest.Mocked<IGuessDataSource>;

    beforeEach(() => {
        mockDatasource = {
            findUnresolvedGuessByUserId: jest.fn(),
            createGuess: jest.fn(),
        } as unknown as jest.Mocked<IGuessDataSource>;
        repository = new GuessRepository(mockDatasource);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('findUnresolvedGuessByUserId', () => {
        it('should call findUnresolvedGuessByUserId from the datasource', async () => {
            const userId = 1;
            const result = await repository.findUnresolvedGuessByUserId(userId);

            expect(mockDatasource.findUnresolvedGuessByUserId).toHaveBeenCalledWith(userId);
            expect(result).toBeUndefined();
        });
    });

    describe('createGuess', () => {
        it('should call createGuess from the datasource and return the correct entity', async () => {
            const userId = 1;
            const guess = GuessTypeEnum.DOWN;
            const currentPrice = 100;
            const placedAt = new Date();

            const expectedResult: IGuessEntity = new GuessEntity();
            expectedResult.isPlaced = true;
            expectedResult.placedAt = placedAt;

            mockDatasource.createGuess.mockResolvedValue({
                id: 1,
                user_id: 1,
                created_at: placedAt,
            } as Guess);

            const result = await repository.createGuess(userId, guess, currentPrice);

            expect(mockDatasource.createGuess).toHaveBeenCalledWith(userId, guess, currentPrice);
            expect(result).toEqual(expectedResult);
        });
    });
});
