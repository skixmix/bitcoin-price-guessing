import { IGuessRequestEntity } from '../entities/guess-request.entity';

export interface IGuessingRepository {
    performGuess(guess: IGuessRequestEntity): Promise<void>;
}
