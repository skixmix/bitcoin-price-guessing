import { Repository } from 'typeorm';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { Price } from '../models/price.model';
import { PriceDatasource } from './price.datasource';
import { IPriceDatasource } from './price.datasource.interface';

describe('PriceDatasource', () => {
    let datasource: IPriceDatasource;
    let mockDatabaseRepo: jest.Mocked<Repository<Price>>;

    beforeEach(() => {
        mockDatabaseRepo = {
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Repository<Price>>;

        datasource = new PriceDatasource(mockDatabaseRepo);
    });

    describe('getCurrentPriceForPair', () => {
        it('should call findOneBy from the repository', async () => {
            const pair = AvailablePairsEnum.BTC_USD;
            await datasource.getCurrentPriceForPair(pair);
            expect(mockDatabaseRepo.findOne).toHaveBeenCalledWith({ where: { pair } });
        });

        it('should return null if nothing found', async () => {
            const pair = AvailablePairsEnum.BTC_USD;
            mockDatabaseRepo.findOne.mockResolvedValue(null);

            const result = await datasource.getCurrentPriceForPair(pair);

            expect(result).toBeNull();
        });

        it('should return the price if found', async () => {
            const pair = AvailablePairsEnum.BTC_USD;
            const price = 100;
            const fakeResponse: Price = {
                pair,
                price,
            } as Price;
            mockDatabaseRepo.findOne.mockResolvedValue(fakeResponse);

            const result = await datasource.getCurrentPriceForPair(pair);

            expect(result).toBe(price);
        });
    });
});
