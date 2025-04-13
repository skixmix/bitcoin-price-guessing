import { ScoreService } from './score.service';
import { IScoreService } from './score.service.interface';

describe('ScoreService', () => {
    let scoreService: IScoreService;
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

        scoreService = new ScoreService();
        onNewPriceMock = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should not create a new EventSource if one already exists', () => {
        scoreService.streamScore({
            onNewScore: jest.fn(),
        });

        // Try to call streamScore again
        scoreService.streamScore({
            onNewScore: jest.fn(),
        });

        expect(window.EventSource).toHaveBeenCalledTimes(1);
    });
});
