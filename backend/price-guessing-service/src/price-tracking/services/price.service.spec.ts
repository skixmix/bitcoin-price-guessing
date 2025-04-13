import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { IPriceRepository } from '../repositories/price.repository.interface';
import { PriceService } from './price.service';
import { IPriceService } from './price.service.interface';

describe('PriceService', () => {
    let service: IPriceService;
    let mockRepository: jest.Mocked<IPriceRepository>;

    const pair = AvailablePairsEnum.BTC_USD;

    beforeEach(() => {
        mockRepository = {
            getPriceForPair: jest.fn(),
        } as jest.Mocked<IPriceRepository>;
        service = new PriceService(mockRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('getCurrentPriceForPairOrZero', () => {
        it('should call getCurrentPriceForPair from the repository', async () => {
            await service.getCurrentPriceForPairOrZero(pair);
            expect(mockRepository.getPriceForPair).toHaveBeenCalledWith(pair);
        });

        it('should return 0 if nothing found', async () => {
            mockRepository.getPriceForPair.mockResolvedValue(null);

            const result = await service.getCurrentPriceForPairOrZero(pair);

            expect(result).toBe(0);
        });

        it('should return the price from the repository', async () => {
            const price = 100;
            mockRepository.getPriceForPair.mockResolvedValue(price);
            const result = await service.getCurrentPriceForPairOrZero(pair);

            expect(result).toBe(price);
        });
    });
});
