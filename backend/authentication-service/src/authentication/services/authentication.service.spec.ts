import { IUserEntity } from '../entities/user.entity';
import { IAuthenticationRepository } from '../repositories/authentication.repository.interface';
import { AuthenticationService } from './authentication.service';
import { IAuthenticationService } from './authentication.service.interface';

describe('AuthenticationService', () => {
    let service: IAuthenticationService;
    let mockAuthenticationRepository: jest.Mocked<IAuthenticationRepository>;

    const username = 'testuser';

    beforeEach(() => {
        mockAuthenticationRepository = {
            findUserByUsername: jest.fn(),
            createUser: jest.fn(),
        } as unknown as jest.Mocked<IAuthenticationRepository>;

        service = new AuthenticationService(mockAuthenticationRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('findOrCreateUser', () => {
        it('should call findUserByUsername with the provided username', async () => {
            mockAuthenticationRepository.findUserByUsername.mockResolvedValue(null);

            await service.findOrCreateUser(username);

            expect(mockAuthenticationRepository.findUserByUsername).toHaveBeenCalledWith(username);
        });

        describe('When the user is found', () => {
            const mockFoundUser: IUserEntity = { id: 1, username };

            beforeEach(() => {
                mockAuthenticationRepository.findUserByUsername.mockResolvedValue(mockFoundUser);
            });

            it('should return the found user', async () => {
                const result = await service.findOrCreateUser(username);

                expect(result).toEqual(mockFoundUser);
            });
        });

        describe('When the user is not found', () => {
            beforeEach(() => {
                mockAuthenticationRepository.findUserByUsername.mockResolvedValue(null);
            });

            it('should call createUser', async () => {
                await service.findOrCreateUser(username);

                expect(mockAuthenticationRepository.createUser).toHaveBeenCalledWith(username);
            });

            it('should return the created user', async () => {
                const mockCreatedUser: IUserEntity = { id: 2, username };
                mockAuthenticationRepository.createUser.mockResolvedValue(mockCreatedUser);

                const result = await service.findOrCreateUser(username);

                expect(result).toEqual(mockCreatedUser);
            });
        });
    });
});
