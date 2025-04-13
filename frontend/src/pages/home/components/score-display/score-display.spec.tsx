import { act, render, screen } from '@testing-library/react';
import { IScoreDisplayEntity } from '../../entities/score-display.entity';
import { scoreServiceInstance } from '../../services/score/score.service.instance';
import ScoreDisplay from './score-display';

jest.mock('../../services/score/score.service.instance', () => ({
    scoreServiceInstance: {
        streamScore: jest.fn(),
    },
}));

describe('ScoreDisplay', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('shows "Loading score..." initially', () => {
        render(<ScoreDisplay />);
        expect(screen.getByText(/Your score/i)).toBeDefined();
        expect(screen.getByText(/Loading score/i)).toBeDefined();
    });

    it('displays score data when scoreServiceInstance.streamScore emits data', () => {
        const mockScore: IScoreDisplayEntity = {
            score: 100,
        };

        let capturedCallback: (score: IScoreDisplayEntity) => void = () => {};

        (scoreServiceInstance.streamScore as jest.Mock).mockImplementation(({ onNewScore }) => {
            capturedCallback = onNewScore;
        });

        render(<ScoreDisplay />);

        act(() => {
            capturedCallback(mockScore);
        });

        expect(screen.getByText(/Your score/i)).toBeDefined();
        expect(screen.getByText(/100/i)).toBeDefined();
    });

    it('calls streamScore with the correct parameters', () => {
        render(<ScoreDisplay />);
        expect(scoreServiceInstance.streamScore).toHaveBeenCalledWith(
            expect.objectContaining({
                onNewScore: expect.any(Function),
            }),
        );
    });
});
