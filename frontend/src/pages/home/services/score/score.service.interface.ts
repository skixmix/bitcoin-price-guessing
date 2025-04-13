import { IScoreDisplayEntity } from '../../entities/score-display.entity';

export interface IScoreService {
    streamScore(props: IStreamScore): void;
    stopStreaming(): void;
}

export interface IStreamScore {
    onNewScore: (newPrice: IScoreDisplayEntity) => void;
}
