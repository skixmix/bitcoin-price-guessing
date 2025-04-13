import { AvailablePairsEnum } from '../../../common/enums/available-pairs.enum';
import { IGuessingDatasource } from '../datsources/guessing.datasource.interface';
import { GuessRequestDTO } from '../dtos/guess-request.dto';
import { GuessRequestEntity, IGuessRequestEntity } from '../entities/guess-request.entity';
import { GuessTypeEnum } from '../enums/guessing.enum';
import { GuessingRepository } from './guessing.repository';

jest.mock('../datsources/guessing.datasource', () => ({
    GuessingDatasource: jest.fn().mockImplementation(() => ({
        performGuess: jest.fn(),
    })),
}));

describe('GuessingRepository', () => {
    let guessingRepository: GuessingRepository;
    let mockGuessingDatasource: IGuessingDatasource;

    const mockGuess: IGuessRequestEntity = new GuessRequestEntity(AvailablePairsEnum.BTC_USD, GuessTypeEnum.UP);

    beforeEach(() => {
        mockGuessingDatasource = {
            performGuess: jest.fn(),
        } as unknown as IGuessingDatasource;
        guessingRepository = new GuessingRepository(mockGuessingDatasource);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should call performGuess on the datasource with the correct guess DTO', async () => {
        const mockGuessDTO = new GuessRequestDTO(mockGuess.pair, mockGuess.guess);
        (mockGuessingDatasource.performGuess as jest.Mock).mockResolvedValueOnce(undefined);

        await guessingRepository.performGuess(mockGuess);

        expect(mockGuessingDatasource.performGuess).toHaveBeenCalledWith(mockGuessDTO);
    });

    it('should handle errors correctly when performGuess fails', async () => {
        const mockGuessDTO = new GuessRequestDTO(mockGuess.pair, mockGuess.guess);

        const errorMessage = 'Something went wrong';
        (mockGuessingDatasource.performGuess as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        await expect(guessingRepository.performGuess(mockGuess)).rejects.toThrow(errorMessage);

        expect(mockGuessingDatasource.performGuess).toHaveBeenCalledWith(mockGuessDTO);
    });
});
