import { Expose } from 'class-transformer';

export interface IGuessEntity {
    isPlaced: boolean;
    placedAt: Date;
}

export class GuessEntity implements IGuessEntity {
    @Expose()
    isPlaced: boolean;

    @Expose()
    placedAt: Date;
}
