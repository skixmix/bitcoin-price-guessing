import { AvailablePairsEnum } from '../../common/available-pairs.enum';

export interface IPriceDatasource {
    getCurrentPriceForPair(pair: AvailablePairsEnum): Promise<number>;
}
