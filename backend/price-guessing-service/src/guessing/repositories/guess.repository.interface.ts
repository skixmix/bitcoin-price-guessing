import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { GuessTypeEnum } from '../dtos/guess.dto';
import { IGuessEntity } from '../entities/guess.entity';

export interface IGuessRepository {
    findUnresolvedGuessByUserIdAndPair(userId: number, pair: AvailablePairsEnum): Promise<IGuessEntity | undefined>;
    createGuess(
        userId: number,
        guess: GuessTypeEnum,
        currentPrice: number,
        pair: AvailablePairsEnum,
    ): Promise<IGuessEntity>;
}
