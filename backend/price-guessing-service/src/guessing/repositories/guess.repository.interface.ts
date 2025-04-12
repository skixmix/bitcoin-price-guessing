import { GuessTypeEnum } from '../dtos/guess.dto';
import { IGuessEntity } from '../entities/guess.entity';

export interface IGuessRepository {
    findUnresolvedGuessByUserId(userId: number): Promise<IGuessEntity | undefined>;
    createGuess(userId: number, guess: GuessTypeEnum, currentPrice: number): Promise<IGuessEntity>;
}
