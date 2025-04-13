import { Inject, Injectable } from '@nestjs/common';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { PriceDatasource } from '../datasources/price.datasource';
import { IPriceDatasource } from '../datasources/price.datasource.interface';
import { IPriceRepository } from './price.repository.interface';

@Injectable()
export class PriceRepository implements IPriceRepository {
    constructor(
        @Inject(PriceDatasource)
        private readonly _priceDatasource: IPriceDatasource,
    ) {}

    async getPriceForPair(pair: AvailablePairsEnum): Promise<number | undefined> {
        const foundPrice = await this._priceDatasource.getCurrentPriceForPair(pair);

        if (foundPrice === null || foundPrice === undefined) {
            return undefined;
        }

        return foundPrice;
    }
}
