export interface IScoreDisplayEntity {
    score: number;
}

export class ScoreDisplayEntity implements IScoreDisplayEntity {
    score: number;

    constructor(data: Readonly<IScoreDisplayEntity>) {
        this.score = data.score;
    }
}
