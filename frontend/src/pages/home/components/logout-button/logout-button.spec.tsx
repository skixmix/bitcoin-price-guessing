import { fireEvent, render, screen } from '@testing-library/react';
import { authenticationServiceInstance } from '../../../login/services/authentication.service.instance';
import { priceServiceInstance } from '../../services/price/price.service.instance';
import { scoreServiceInstance } from '../../services/score/score.service.instance';
import LogoutButton from './logout-button';

jest.mock('../../../login/services/authentication.service.instance', () => ({
    authenticationServiceInstance: {
        logout: jest.fn(),
    },
}));

jest.mock('../../services/price/price.service.instance', () => ({
    priceServiceInstance: {
        stopStreaming: jest.fn(),
    },
}));

jest.mock('../../services/score/score.service.instance', () => ({
    scoreServiceInstance: {
        stopStreaming: jest.fn(),
    },
}));

describe('LogoutButton', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('calls all services to perform logout when clicked', () => {
        render(<LogoutButton />);

        const button = screen.getByRole('button', { name: /log out/i });
        fireEvent.click(button);

        expect(priceServiceInstance.stopStreaming).toHaveBeenCalledTimes(1);
        expect(scoreServiceInstance.stopStreaming).toHaveBeenCalledTimes(1);
        expect(authenticationServiceInstance.logout).toHaveBeenCalledTimes(1);
    });
});
