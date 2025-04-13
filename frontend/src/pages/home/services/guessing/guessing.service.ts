import { AxiosError, HttpStatusCode } from 'axios';
import { IGuessRequestEntity } from '../../entities/guess-request.entity';
import { GuessingRepository } from '../../repositories/guessing.repository';
import { IGuessingRepository } from '../../repositories/guessing.repository.interface';
import { IGuessingService } from './guessing.service.interface';

export class GuessingService implements IGuessingService {
    constructor(private readonly _guessingRepository: IGuessingRepository = new GuessingRepository()) {}

    public async performGuess(guess: IGuessRequestEntity): Promise<void> {
        try {
            await this._guessingRepository.performGuess(guess);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error while performing guess', axiosError.response?.status);
            if (axiosError.response?.status === HttpStatusCode.Forbidden) {
                throw new Error('Cannot make new guess');
            }
        }
    }
}
