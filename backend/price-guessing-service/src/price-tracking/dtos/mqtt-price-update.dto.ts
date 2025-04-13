import { Expose } from 'class-transformer';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';

export interface IMqttPriceUpdateDTO {
    pair: AvailablePairsEnum;
}

export class MqttPriceUpdateDTO implements IMqttPriceUpdateDTO {
    @Expose()
    pair: AvailablePairsEnum;
}
