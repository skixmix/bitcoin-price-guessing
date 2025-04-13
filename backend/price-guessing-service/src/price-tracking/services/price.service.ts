import { Inject, Injectable } from '@nestjs/common';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { PriceRepository } from '../repositories/price.repository';
import { IPriceRepository } from '../repositories/price.repository.interface';
import { IPriceService } from './price.service.interface';

@Injectable()
export class PriceService implements IPriceService {
    constructor(
        @Inject(PriceRepository)
        private readonly _priceRepository: IPriceRepository,
    ) {}

    async getCurrentPriceForPairOrZero(pair: AvailablePairsEnum): Promise<number> {
        const currentPrice = await this._priceRepository.getPriceForPair(pair);
        return currentPrice ?? 0;
    }
}
