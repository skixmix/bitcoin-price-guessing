import { IGuessRequestDTO } from '../dtos/guess-request.dto';

export interface IGuessingDatasource {
    performGuess(guessRequest: IGuessRequestDTO): Promise<void>;
}
