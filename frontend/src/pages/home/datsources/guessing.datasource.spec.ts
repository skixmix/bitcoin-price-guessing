import { AxiosError } from 'axios';
import axiosInstance from '../../../common/axios-instance/axios-instance';
import { AvailablePairsEnum } from '../../../common/enums/available-pairs.enum';
import { GuessRequestDTO, IGuessRequestDTO } from '../dtos/guess-request.dto';
import { GuessTypeEnum } from '../enums/guessing.enum';
import { GuessingDatasource } from './guessing.datasource';
import { IGuessingDatasource } from './guessing.datasource.interface';

jest.mock('../../../common/axios-instance/axios-instance', () => ({
    post: jest.fn(),
}));

describe('GuessingDatasource', () => {
    let guessingDatasource: IGuessingDatasource;
    const mockGuess: IGuessRequestDTO = new GuessRequestDTO(AvailablePairsEnum.BTC_USD, GuessTypeEnum.UP);

    beforeEach(() => {
        guessingDatasource = new GuessingDatasource();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should perform a guess and call axios post method', async () => {
        (axiosInstance.post as jest.Mock).mockResolvedValueOnce({});

        await guessingDatasource.performGuess(mockGuess);

        expect(axiosInstance.post).toHaveBeenCalledWith('/api/guess', mockGuess);
    });

    it('should handle errors when axios post fails', async () => {
        const errorMessage = 'Network Error';
        (axiosInstance.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        try {
            await guessingDatasource.performGuess(mockGuess);
        } catch (error) {
            expect((error as AxiosError).message).toBe(errorMessage);
        }

        expect(axiosInstance.post).toHaveBeenCalledWith('/api/guess', mockGuess);
    });
});
