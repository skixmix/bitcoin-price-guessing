import { Expose } from 'class-transformer';

export interface IScoreDTO {
    score: number;
}

export class ScoreDTO implements IScoreDTO {
    @Expose()
    score: number;
}
