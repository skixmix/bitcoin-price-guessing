import { AvailablePairsEnum } from '../../../common/enums/available-pairs.enum';
import { GuessTypeEnum } from '../enums/guessing.enum';

export interface IGuessRequestDTO {
    pair: AvailablePairsEnum;
    guess: GuessTypeEnum;
}

export class GuessRequestDTO implements IGuessRequestDTO {
    pair: AvailablePairsEnum;
    guess: GuessTypeEnum;

    constructor(pair: AvailablePairsEnum, guess: GuessTypeEnum) {
        this.pair = pair;
        this.guess = guess;
    }
}
