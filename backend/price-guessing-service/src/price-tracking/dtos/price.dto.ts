import { Expose } from 'class-transformer';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';

export interface IPriceDTO {
    pair: AvailablePairsEnum;
    price: number;
}

export class PriceDto implements IPriceDTO {
    @Expose()
    pair: AvailablePairsEnum;

    @Expose()
    price: number;
}
