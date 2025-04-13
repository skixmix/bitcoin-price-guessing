import { AvailablePairsEnum } from '../../../../common/enums/available-pairs.enum';
import { PriceService } from './price.service';
import { IPriceService } from './price.service.interface';

describe('PriceService', () => {
    let priceService: IPriceService;
    let onNewPriceMock: jest.Mock;

    beforeEach(() => {
        Object.defineProperty(window, 'EventSource', {
            writable: true,
            value: jest.fn().mockImplementation(() => ({
                close: jest.fn(),
                addEventListener: jest.fn((_event: string, _callback: (_message: MessageEvent) => {}) => {}),
                onmessage: jest.fn(),
            })),
        });

        priceService = new PriceService();
        onNewPriceMock = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should not create a new EventSource if one already exists', () => {
        priceService.streamPrice({
            pair: AvailablePairsEnum.BTC_USD,
            onNewPrice: jest.fn(),
        });

        // Try to call streamPrice again
        priceService.streamPrice({
            pair: AvailablePairsEnum.BTC_USD,
            onNewPrice: jest.fn(),
        });

        expect(window.EventSource).toHaveBeenCalledTimes(1);
    });
});
