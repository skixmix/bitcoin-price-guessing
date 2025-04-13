import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { Price } from '../models/price.model';
import { IPriceDatasource } from './price.datasource.interface';

@Injectable()
export class PriceDatasource implements IPriceDatasource {
    constructor(
        @InjectRepository(Price)
        private _priceDatabaseRepository: Repository<Price>,
    ) {}

    async getCurrentPriceForPair(pair: AvailablePairsEnum): Promise<number | null> {
        const price = await this._priceDatabaseRepository.findOne({
            where: { pair },
        });

        if (price === null || price === undefined) {
            return null;
        }

        return price.price;
    }
}
