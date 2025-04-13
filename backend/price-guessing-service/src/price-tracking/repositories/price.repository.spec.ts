import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { IPriceDatasource } from '../datasources/price.datasource.interface';
import { PriceRepository } from './price.repository';
import { IPriceRepository } from './price.repository.interface';

describe('PriceRepository', () => {
    let repository: IPriceRepository;
    let mockDatasource: jest.Mocked<IPriceDatasource>;

    beforeEach(() => {
        mockDatasource = {
            getCurrentPriceForPair: jest.fn(),
        } as unknown as jest.Mocked<IPriceDatasource>;
        repository = new PriceRepository(mockDatasource);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('getPriceForPair', () => {
        it('should call getCurrentPriceForPair from the datasource', async () => {
            const pair = AvailablePairsEnum.BTC_USD;
            await repository.getPriceForPair(pair);

            expect(mockDatasource.getCurrentPriceForPair).toHaveBeenCalledWith(pair);
        });

        it('should return undefined if nothing found', async () => {
            const pair = AvailablePairsEnum.BTC_USD;
            mockDatasource.getCurrentPriceForPair.mockResolvedValue(null);

            const result = await repository.getPriceForPair(pair);

            expect(result).toBeUndefined();
        });

        it('should return the price from the datasource', async () => {
            const pair = AvailablePairsEnum.BTC_USD;
            const price = 100;
            mockDatasource.getCurrentPriceForPair.mockResolvedValue(price);
            const result = await repository.getPriceForPair(pair);

            expect(result).toBe(price);
        });
    });
});
