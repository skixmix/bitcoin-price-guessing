import { PriceDisplayEntity } from '../../entities/price-display.entity';
import { IPriceService, IStreamPrice } from './price.service.interface';

export class PriceService implements IPriceService {
    private _eventSource: EventSource | null = null;
    private _EVENT_SOURCE_URL = '/api/price/stream';

    streamPrice(props: Readonly<IStreamPrice>): void {
        if (this._eventSource) {
            return;
        }

        const { pair, onNewPrice } = props;
        this._eventSource = new EventSource(`${this._EVENT_SOURCE_URL}/${pair}`, {
            withCredentials: true,
        });
        this._eventSource.onmessage = function mapDataMessageToDTO(message: MessageEvent) {
            const messageData = message.data;
            const parsedMessageData = JSON.parse(messageData);
            const dataToEntity = new PriceDisplayEntity(parsedMessageData);
            onNewPrice(dataToEntity);
        };

        this._eventSource.onerror = () => {
            console.error('Error while listening for price events!');
            this._eventSource?.close();
            this._eventSource = null;
        };
    }

    stopStreaming(): void {
        this._eventSource?.close();
        this._eventSource = null;
    }
}
