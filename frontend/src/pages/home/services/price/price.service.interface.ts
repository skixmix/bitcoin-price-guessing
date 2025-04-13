import { AvailablePairsEnum } from '../../../../common/enums/available-pairs.enum';
import { IPriceDisplayEntity } from '../../entities/price-display.entity';

export interface IPriceService {
    streamPrice(props: IStreamPrice): void;
    stopStreaming(): void;
}

export interface IStreamPrice {
    pair: AvailablePairsEnum;
    onNewPrice: (newPrice: IPriceDisplayEntity) => void;
}
