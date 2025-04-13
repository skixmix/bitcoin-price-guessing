import { AxiosInstance } from 'axios';
import axiosInstance from '../../../common/axios-instance/axios-instance';
import { IGuessRequestDTO } from '../dtos/guess-request.dto';
import { IGuessingDatasource } from './guessing.datasource.interface';

export class GuessingDatasource implements IGuessingDatasource {
    private readonly _GUESS_URL = '/api/guess';

    constructor(private readonly _axiosInstance: AxiosInstance = axiosInstance) {}

    public async performGuess(guess: IGuessRequestDTO): Promise<void> {
        await this._axiosInstance.post(this._GUESS_URL, guess);
    }
}
