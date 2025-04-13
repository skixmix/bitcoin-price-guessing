import { GuessingDatasource } from '../datsources/guessing.datasource';
import { IGuessingDatasource } from '../datsources/guessing.datasource.interface';
import { GuessRequestDTO } from '../dtos/guess-request.dto';
import { IGuessRequestEntity } from '../entities/guess-request.entity';
import { IGuessingRepository } from './guessing.repository.interface';

export class GuessingRepository implements IGuessingRepository {
    constructor(private readonly _guessingDatasource: IGuessingDatasource = new GuessingDatasource()) {}

    async performGuess(guess: IGuessRequestEntity): Promise<void> {
        const guessDTO = new GuessRequestDTO(guess.pair, guess.guess);
        await this._guessingDatasource.performGuess(guessDTO);
    }
}
