import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { GuessTypeEnum } from '../dtos/guess.dto';
import { Guess } from '../models/guess.model';

export interface IGuessDataSource {
    findUnresolvedGuessByUserIdAndPair(userId: number, pair: AvailablePairsEnum): Promise<Guess | null>;
    createGuess(userId: number, guess: GuessTypeEnum, currentPrice: number, pair: AvailablePairsEnum): Promise<Guess>;
}
