import { GuessTypeEnum } from '../dtos/guess.dto';
import { IGuessEntity } from '../entities/guess.entity';

export interface IGuessService {
    placeGuess(userId: number, guess: GuessTypeEnum, currentPrice: number): Promise<IGuessEntity>;
}
