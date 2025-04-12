import { JwtService } from '@nestjs/jwt';
import { IAuthenticationService } from '../services/authentication.service.interface';
import { AuthenticationController } from './authentication.controller';

describe('AuthenticationController', () => {
    let controller: AuthenticationController;
    let mockJwtService: jest.Mocked<JwtService>;
    let mockAuthService: jest.Mocked<IAuthenticationService>;

    const loginDTO = {
        username: 'testuser',
    };
    const token = 'test-token';

    beforeEach(() => {
        mockJwtService = {
            sign: jest.fn(),
        } as unknown as jest.Mocked<JwtService>;

        mockAuthService = {
            findOrCreateUser: jest.fn(),
        } as unknown as jest.Mocked<IAuthenticationService>;

        controller = new AuthenticationController(mockAuthService, mockJwtService);

        mockAuthService.findOrCreateUser.mockResolvedValue({
            id: 1,
            username: loginDTO.username,
        });
        mockJwtService.sign.mockReturnValue(token);
    });

    describe('login', () => {
        it('should return the user authenticated token', async () => {
            const result = await controller.login(loginDTO);

            expect(result.token).toBe(token);
        });

        it('should call the authentication service to find or create the user', async () => {
            await controller.login(loginDTO);

            expect(mockAuthService.findOrCreateUser).toHaveBeenCalledWith(loginDTO.username);
        });

        it('should call the jwt service to sign the token', async () => {
            await controller.login(loginDTO);

            expect(mockJwtService.sign).toHaveBeenCalledWith({ username: loginDTO.username });
        });
    });
});
