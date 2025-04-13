import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from './login-page';
import { authenticationServiceInstance } from './services/authentication.service.instance';

jest.mock('./services/authentication.service.instance', () => ({
    authenticationServiceInstance: {
        loginWithUsername: jest.fn(),
    },
}));

describe('LoginPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the login page correctly', () => {
        render(<LoginPage />);

        expect(screen.getByText('Please login')).toBeDefined();
        expect(screen.getByText('Log In')).toBeDefined();
    });

    it('should not call loginWithUsername if no username is entered', async () => {
        render(<LoginPage />);

        const loginButton = screen.getByText('Log In');

        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(authenticationServiceInstance.loginWithUsername).not.toHaveBeenCalled();
        });
    });
});
