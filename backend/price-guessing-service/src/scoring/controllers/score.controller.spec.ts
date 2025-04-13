import { MessageEvent } from '@nestjs/common';
import { Observable, Subscriber } from 'rxjs';
import { IFastifyRequestWithUserId } from '../../utils/guards/authentication.guard.interface';
import { IScoreService } from '../services/score.service.interface';
import { ScoreController } from './score.controller';

describe('ScoreController', () => {
    let controller: ScoreController;
    let mockScoreService: jest.Mocked<IScoreService>;
    let mockRequest: IFastifyRequestWithUserId;

    beforeEach(() => {
        mockScoreService = {
            getOrInitializeScoreByUserId: jest.fn(),
        } as unknown as jest.Mocked<IScoreService>;

        mockRequest = {
            userId: 1,
            raw: { on: jest.fn() }, // Mocking raw socket event handling (for 'close')
        } as unknown as IFastifyRequestWithUserId;

        controller = new ScoreController(mockScoreService);
    });

    describe('getScoreStream', () => {
        it('should return an observable', () => {
            const observable = controller.getScoreStream(mockRequest);
            expect(observable).toBeInstanceOf(Observable);
        });

        it('should emit score data to the user when score is initialized', async () => {
            const score = 100;
            mockScoreService.getOrInitializeScoreByUserId.mockResolvedValue(score);

            const observable = controller.getScoreStream(mockRequest);

            const subscriber = {
                next: jest.fn(),
                complete: jest.fn(),
            } as unknown as Subscriber<MessageEvent>;

            observable.subscribe(subscriber);

            await new Promise((resolve) => setTimeout(resolve, 0)); // Ensure async completion

            expect(subscriber.next).toHaveBeenCalledWith({
                data: { score },
            });
        });
    });

    describe('handleScoreUpdateEvent', () => {
        it('should emit the updated score to all connected users', async () => {
            const score = 200;
            const subscriberMock = {
                next: jest.fn(),
                complete: jest.fn(),
            } as unknown as Subscriber<MessageEvent>;

            controller['_userStreams'].set(1, subscriberMock);

            mockScoreService.getOrInitializeScoreByUserId.mockResolvedValue(score);

            await controller.handleScoreUpdateEvent();

            expect(subscriberMock.next).toHaveBeenCalledWith({
                data: { score },
            });
        });
    });
});
