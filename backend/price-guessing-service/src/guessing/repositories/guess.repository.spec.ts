import { AvailablePairsEnum } from '../../common/available-pairs.enum';
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
            findUnresolvedGuessByUserIdAndPair: jest.fn(),
            createGuess: jest.fn(),
        } as unknown as jest.Mocked<IGuessDataSource>;
        repository = new GuessRepository(mockDatasource);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('findUnresolvedGuessByUserIdAndPair', () => {
        it('should call findUnresolvedGuessByUserId from the datasource', async () => {
            const userId = 1;
            const pair = AvailablePairsEnum.BTC_USD;
            const result = await repository.findUnresolvedGuessByUserIdAndPair(userId, pair);

            expect(mockDatasource.findUnresolvedGuessByUserIdAndPair).toHaveBeenCalledWith(userId, pair);
            expect(result).toBeUndefined();
        });
    });

    describe('createGuess', () => {
        it('should call createGuess from the datasource and return the correct entity', async () => {
            const userId = 1;
            const guess = GuessTypeEnum.DOWN;
            const pair = AvailablePairsEnum.BTC_USD;
            const currentPrice = 100;
            const placedAt = new Date();

            const expectedResult: IGuessEntity = new GuessEntity();
            expectedResult.isPlaced = true;
            expectedResult.placedAt = placedAt;

            mockDatasource.createGuess.mockResolvedValue({
                id: 1,
                userId: 1,
                createdAt: placedAt,
            } as Guess);

            const result = await repository.createGuess(userId, guess, currentPrice, pair);

            expect(mockDatasource.createGuess).toHaveBeenCalledWith(userId, guess, currentPrice, pair);
            expect(result).toEqual(expectedResult);
        });
    });
});
