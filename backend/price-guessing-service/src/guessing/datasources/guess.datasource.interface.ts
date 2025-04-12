import { GuessTypeEnum } from '../dtos/guess.dto';
import { Guess } from '../models/guess.model';

export interface IGuessDataSource {
    findUnresolvedGuessByUserId(userId: number): Promise<Guess | null>;
    createGuess(userId: number, guess: GuessTypeEnum, currentPrice: number): Promise<Guess>;
}
