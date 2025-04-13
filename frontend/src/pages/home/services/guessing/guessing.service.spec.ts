import { AxiosError, HttpStatusCode } from 'axios';
import { AvailablePairsEnum } from '../../../../common/enums/available-pairs.enum';
import { GuessRequestEntity, IGuessRequestEntity } from '../../entities/guess-request.entity';
import { GuessTypeEnum } from '../../enums/guessing.enum';
import { IGuessingRepository } from '../../repositories/guessing.repository.interface';
import { GuessingService } from './guessing.service';

jest.mock('../../repositories/guessing.repository', () => ({
    GuessingRepository: jest.fn().mockImplementation(() => ({
        performGuess: jest.fn(),
    })),
}));

describe('GuessingService', () => {
    let guessingService: GuessingService;
    let mockGuessingRepository: IGuessingRepository;

    const mockGuess: IGuessRequestEntity = new GuessRequestEntity(AvailablePairsEnum.BTC_USD, GuessTypeEnum.UP);

    beforeEach(() => {
        mockGuessingRepository = {
            performGuess: jest.fn(),
        };
        guessingService = new GuessingService(mockGuessingRepository);

        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should call performGuess on the repository with correct guess', async () => {
        (mockGuessingRepository.performGuess as jest.Mock).mockResolvedValueOnce(undefined);

        await guessingService.performGuess(mockGuess);

        // Verify that performGuess was called with the correct guess
        expect(mockGuessingRepository.performGuess).toHaveBeenCalledWith(mockGuess);
    });

    it('should handle errors and throw specific error when status is Forbidden', async () => {
        const axiosError: AxiosError = {
            isAxiosError: true,
            response: {
                status: HttpStatusCode.Forbidden,
                data: 'Forbidden',
                statusText: 'Forbidden',
                headers: {},
                config: {},
            },
            config: {},
            toJSON: jest.fn(),
        } as unknown as AxiosError;

        (mockGuessingRepository.performGuess as jest.Mock).mockRejectedValueOnce(axiosError);

        await expect(guessingService.performGuess(mockGuess)).rejects.toThrowError('Cannot make new guess');

        expect(mockGuessingRepository.performGuess).toHaveBeenCalledWith(mockGuess);
    });

    it('should log the error response when an error occurs', async () => {
        const axiosError: AxiosError = {
            isAxiosError: true,
            response: {
                status: HttpStatusCode.InternalServerError,
                data: 'Internal Server Error',
                statusText: 'Internal Server Error',
                headers: {},
                config: {},
            },
            config: {},
            toJSON: jest.fn(),
        } as unknown as AxiosError;

        (mockGuessingRepository.performGuess as jest.Mock).mockRejectedValueOnce(axiosError);

        await guessingService.performGuess(mockGuess);
        expect(console.error).toHaveBeenCalledWith('Error while performing guess', axiosError.response?.status);
    });
});
