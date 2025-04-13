import { MqttContext } from '@nestjs/microservices';
import { Observable, Subscriber } from 'rxjs';
import { AvailablePairsEnum } from '../../common/available-pairs.enum';
import { IFastifyRequestWithUserId } from '../../utils/guards/authentication.guard.interface';
import { IPriceDTO } from '../dtos/price.dto';
import { IPriceService } from '../services/price.service.interface';
import { PriceController } from './price.controller';

describe('PriceTrackingController', () => {
    let controller: PriceController;
    let mockPriceService: jest.Mocked<IPriceService>;
    let mockRequest: IFastifyRequestWithUserId;

    beforeEach(() => {
        mockPriceService = {
            getCurrentPriceForPairOrZero: jest.fn(),
        } as unknown as jest.Mocked<IPriceService>;

        mockRequest = {
            userId: 1,
            raw: { on: jest.fn() }, // Mocking raw socket event handling (for 'close')
        } as unknown as IFastifyRequestWithUserId;

        controller = new PriceController(mockPriceService);
    });

    describe('getPriceStreamForPair', () => {
        it('should return an observable', async () => {
            const result = await controller.getPriceStreamForPair(AvailablePairsEnum.BTC_USD, mockRequest);
            expect(result).toBeInstanceOf(Observable);
        });

        it('should store the subscriber in _userStreams', async () => {
            const result$ = await controller.getPriceStreamForPair(AvailablePairsEnum.BTC_USD, mockRequest);
            const subscriberMock = {
                complete: jest.fn(),
                next: jest.fn(),
            } as unknown as Subscriber<MessageEvent<IPriceDTO>>;

            result$.subscribe(subscriberMock);

            const entry = controller['_userStreams'].get(1);
            expect(entry).toBeDefined();
            expect(entry?.pair).toBe(AvailablePairsEnum.BTC_USD);
            expect(entry?.subscriber).toBeDefined();
        });
    });

    describe('handlePairPriceUpdate', () => {
        it('should emit price to matching user pair', async () => {
            const subscriberMock = {
                next: jest.fn(),
                complete: jest.fn(),
            } as unknown as Subscriber<MessageEvent<IPriceDTO>>;

            controller['_userStreams'].set(1, {
                pair: AvailablePairsEnum.BTC_USD,
                subscriber: subscriberMock,
            });

            const price = 42000;
            mockPriceService.getCurrentPriceForPairOrZero.mockResolvedValue(price);

            const mockContext: Partial<MqttContext> = {
                getTopic: () => 'price/update/BTCUSD',
            };

            await controller.handlePairPriceUpdate(mockContext as MqttContext);

            expect(subscriberMock.next).toHaveBeenCalledWith({
                data: { price, pair: AvailablePairsEnum.BTC_USD },
            });
        });

        it('should not emit if user is subscribed to a different pair', async () => {
            const subscriberMock = {
                next: jest.fn(),
                complete: jest.fn(),
            } as unknown as Subscriber<MessageEvent<IPriceDTO>>;

            controller['_userStreams'].set(1, {
                pair: 'ETHUSD' as AvailablePairsEnum,
                subscriber: subscriberMock,
            });

            const mockContext: Partial<MqttContext> = {
                getTopic: () => 'price/update/BTCUSD',
            };

            await controller.handlePairPriceUpdate(mockContext as MqttContext);

            expect(subscriberMock.next).not.toHaveBeenCalled();
        });
    });
});
