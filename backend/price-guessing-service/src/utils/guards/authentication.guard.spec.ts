import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './authentication.guard';
import { IFastifyRequestWithUserId } from './authentication.guard.interface';

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;
    let mockJwtService: jest.Mocked<JwtService>;
    let mockContext: jest.Mocked<ExecutionContext>;
    let mockGetRequest: jest.Mock;

    const decodedToken = {
        userId: 1,
    };

    const authTokenCookieName = 'authToken';

    beforeEach(() => {
        mockGetRequest = jest.fn();

        mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: mockGetRequest,
            }),
        } as unknown as jest.Mocked<ExecutionContext>;

        mockJwtService = {
            verify: jest.fn(),
        } as unknown as jest.Mocked<JwtService>;

        Object.defineProperty(process.env, 'AUTH_COOKIE_NAME', {
            value: authTokenCookieName,
            writable: true,
            configurable: true,
        });

        mockJwtService.verify.mockReturnValue(decodedToken);

        guard = new JwtAuthGuard(mockJwtService);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('canActivate', () => {
        beforeEach(() => {
            mockGetRequest.mockReturnValue({
                cookies: {
                    [authTokenCookieName]: 'test-token',
                },
            } as unknown as IFastifyRequestWithUserId);
        });

        it('should check if a token is in the cookies', async () => {
            await guard.canActivate(mockContext);

            expect(mockJwtService.verify).toHaveBeenCalledWith('test-token');
        });

        describe('When there is a token', () => {
            it('should return true if the token is valid', async () => {
                mockJwtService.verify.mockReturnValue(decodedToken);

                const result = await guard.canActivate(mockContext);

                expect(result).toBe(true);
            });

            it('should throw Unauthorized exception if the token is invalid', async () => {
                jest.spyOn(console, 'error').mockImplementation();

                mockJwtService.verify.mockImplementation(() => {
                    throw new Error('Invalid token');
                });
                await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException());
            });
        });

        describe('When ther is not a token', () => {
            beforeEach(() => {
                mockGetRequest.mockReturnValue({
                    cookies: {},
                } as unknown as IFastifyRequestWithUserId);
            });

            it('should throw an Unauthorized exception', async () => {
                jest.spyOn(console, 'error').mockImplementation();

                await expect(guard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException());
            });
        });
    });
});
