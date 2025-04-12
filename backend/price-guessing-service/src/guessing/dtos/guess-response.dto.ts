import { Expose } from 'class-transformer';

export interface IGuessResponseDTO {
    isPlaced: boolean;
}

export class GuessResponseDTO implements IGuessResponseDTO {
    @Expose()
    isPlaced: boolean;
}
