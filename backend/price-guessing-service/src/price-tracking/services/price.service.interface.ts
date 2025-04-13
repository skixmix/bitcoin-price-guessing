import { AvailablePairsEnum } from '../../common/available-pairs.enum';

export interface IPriceService {
    getCurrentPriceForPairOrZero(pair: AvailablePairsEnum): Promise<number>;
}
