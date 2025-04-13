import { AvailablePairsEnum } from '../../common/available-pairs.enum';

export interface IPriceRepository {
    getPriceForPair(pair: AvailablePairsEnum): Promise<number | undefined>;
}
