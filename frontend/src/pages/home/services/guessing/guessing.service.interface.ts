import { IGuessRequestEntity } from '../../entities/guess-request.entity';

export interface IGuessingService {
    performGuess(guess: IGuessRequestEntity): Promise<void>;
}
