import { GuessEnum } from '../enums/guess.enum';

export interface IUserGuess {
    id: number;
    userId: number;
    guess: GuessEnum;
    priceWhenPlaced: number;
    createdAt: Date;
}
