import { Repository } from 'typeorm';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { GuessTypeEnum } from '../dtos/guess.dto';
import { Guess } from '../models/guess.model';
import { GuessDatasource } from './guess.datasource';
import { IGuessDataSource } from './guess.datasource.interface';

describe('GuessDatasource', () => {
    let datasource: IGuessDataSource;
    let mockGuessDatabaseRepository: jest.Mocked<Repository<Guess>>;
    const userId = 1;
    const fakeDate = new Date('2024-01-01T12:00:00Z');

    const guess = GuessTypeEnum.DOWN;
    const pair = AvailablePairsEnum.BTC_USD;
    const currentPrice = 1;
    const expectedGuess: Guess = {
        guess,
        userId: userId,
        priceWhenPlaced: currentPrice,
        referencePair: pair,
        createdAt: fakeDate,
    } as unknown as Guess;

    beforeEach(() => {
        mockGuessDatabaseRepository = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
        } as unknown as jest.Mocked<Repository<Guess>>;

        datasource = new GuessDatasource(mockGuessDatabaseRepository);

        jest.useFakeTimers();
        jest.setSystemTime(fakeDate);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    describe('findUnresolvedGuessByUserIdAndPair', () => {
        it('should find an unresolved guess by user id', async () => {
            mockGuessDatabaseRepository.findOne.mockResolvedValue(expectedGuess);

            const result = await datasource.findUnresolvedGuessByUserIdAndPair(userId, pair);

            expect(result).toBe(expectedGuess);
        });

        it('should return null if no unresolved guess is found', async () => {
            mockGuessDatabaseRepository.findOne.mockResolvedValue(null);

            const result = await datasource.findUnresolvedGuessByUserIdAndPair(userId, pair);

            expect(result).toBeNull();
        });
    });

    describe('placeGuess', () => {
        beforeEach(() => {
            mockGuessDatabaseRepository.create.mockReturnValue(expectedGuess);
        });

        it('should place a guess', async () => {
            await datasource.createGuess(userId, guess, currentPrice, pair);

            expect(mockGuessDatabaseRepository.create).toHaveBeenCalledWith(expectedGuess);
        });

        it('should save the guess', async () => {
            await datasource.createGuess(userId, guess, currentPrice, pair);

            expect(mockGuessDatabaseRepository.save).toHaveBeenCalledWith(expectedGuess);
        });

        it('should return the guess', async () => {
            const result = await datasource.createGuess(userId, guess, currentPrice, pair);

            expect(result).toBe(expectedGuess);
        });
    });
});
