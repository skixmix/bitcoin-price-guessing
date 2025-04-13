import { act, render, screen } from '@testing-library/react';
import { AvailablePairsEnum } from '../../../../common/enums/available-pairs.enum';
import { IPriceDisplayEntity } from '../../entities/price-display.entity';
import { priceServiceInstance } from '../../services/price/price.service.instance';
import PriceDisplay from './price-display';

jest.mock('../../services/price/price.service.instance', () => ({
    priceServiceInstance: {
        streamPrice: jest.fn(),
    },
}));

describe('PriceDisplay', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('shows "Loading Price..." initially', () => {
        render(<PriceDisplay />);
        expect(screen.getByText(/Current BTC Price/i)).toBeDefined();
        expect(screen.getByText(/Loading Price/i)).toBeDefined();
    });

    it('displays price data when priceServiceInstance.streamPrice emits data', () => {
        const mockPrice: IPriceDisplayEntity = {
            price: 42000,
            updatedAt: new Date('2025-04-13T12:00:00Z'),
        };

        let capturedCallback: (price: IPriceDisplayEntity) => void = () => {};

        (priceServiceInstance.streamPrice as jest.Mock).mockImplementation(({ onNewPrice }) => {
            capturedCallback = onNewPrice;
        });

        render(<PriceDisplay />);

        act(() => {
            capturedCallback(mockPrice);
        });

        expect(screen.getByText(/Current BTC Price/i)).toBeDefined();
        expect(screen.getByText(/42000 USD/i)).toBeDefined();
        expect(screen.getByText(/Updated at/i)).toBeDefined();
    });

    it('calls streamPrice with the correct pair', () => {
        render(<PriceDisplay />);
        expect(priceServiceInstance.streamPrice).toHaveBeenCalledWith(
            expect.objectContaining({
                pair: AvailablePairsEnum.BTC_USD,
                onNewPrice: expect.any(Function),
            }),
        );
    });
});
