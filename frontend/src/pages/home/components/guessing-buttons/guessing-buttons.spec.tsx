import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { guessingServiceInstance } from '../../services/guessing/guessing.service.instance';
import { IGuessingService } from '../../services/guessing/guessing.service.interface';
import GuessingButtons from './guessing-buttons';

jest.mock('../../services/guessing/guessing.service.instance', () => ({
    guessingServiceInstance: {
        performGuess: jest.fn(),
    },
}));

jest.mock('./components/guess-snackbar', () => ({
    __esModule: true,
    default: () => <></>,
}));

describe('GuessingButtons', () => {
    let mockGuessingServiceInstance: jest.Mocked<IGuessingService>;

    beforeEach(() => {
        mockGuessingServiceInstance = jest.mocked(guessingServiceInstance);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should render correctly', () => {
        render(<GuessingButtons />);

        const foundButtons = screen.getAllByRole('button');
        expect(foundButtons).toHaveLength(2);
    });

    it('should call performGuess when a button is clicked', () => {
        render(<GuessingButtons />);

        const buttons = screen.getAllByRole('button');
        act(() => {
            buttons[0].click();
        });

        expect(mockGuessingServiceInstance.performGuess).toHaveBeenCalledTimes(1);
    });
});
