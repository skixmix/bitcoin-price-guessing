import { ScoreDisplayEntity } from '../../entities/score-display.entity';
import { IScoreService, IStreamScore } from './score.service.interface';

export class ScoreService implements IScoreService {
    private _eventSource: EventSource | null = null;
    private _EVENT_SOURCE_URL = '/api/score/stream';

    streamScore(props: Readonly<IStreamScore>): void {
        if (this._eventSource) {
            return;
        }

        const { onNewScore } = props;
        this._eventSource = new EventSource(this._EVENT_SOURCE_URL, {
            withCredentials: true,
        });
        this._eventSource.onmessage = function mapDataMessageToDTO(message: MessageEvent) {
            const messageData = message.data;
            const parsedMessageData = JSON.parse(messageData);
            const dataToEntity = new ScoreDisplayEntity(parsedMessageData);
            onNewScore(dataToEntity);
        };

        this._eventSource.onerror = () => {
            console.error('Error while listening for score events!');
            this._eventSource?.close();
            this._eventSource = null;
        };
    }

    stopStreaming(): void {
        this._eventSource?.close();
        this._eventSource = null;
    }
}
