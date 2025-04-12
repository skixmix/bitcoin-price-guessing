import { IAuthenticationDatasource } from '../datasources/authentication.datasource.interface';
import { UserEntity } from '../entities/user.entity';
import { AuthenticationRepository } from './authentication.repository';
import { IAuthenticationRepository } from './authentication.repository.interface';

describe('AuthenticationRepository', () => {
    let repository: IAuthenticationRepository;
    let mockAuthDatasource: jest.Mocked<IAuthenticationDatasource>;

    const username = 'testuser';

    beforeEach(() => {
        mockAuthDatasource = {
            findUserByUsername: jest.fn(),
            createUser: jest.fn(),
        } as unknown as jest.Mocked<IAuthenticationDatasource>;

        repository = new AuthenticationRepository(mockAuthDatasource);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('findUserByUsername', () => {
        it('should call the datasource to find a user by username', async () => {
            await repository.findUserByUsername(username);

            expect(mockAuthDatasource.findUserByUsername).toHaveBeenCalledWith(username);
        });

        it('should return the mapped user domain entity if the user was found', async () => {
            const foundUser = { id: 1, username };
            mockAuthDatasource.findUserByUsername.mockResolvedValue(foundUser);

            const result = await repository.findUserByUsername(username);

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe(foundUser.id);
            expect(result.username).toBe(foundUser.username);
        });

        it('should return undefined if no user was found', async () => {
            mockAuthDatasource.findUserByUsername.mockResolvedValue(null);

            const result = await repository.findUserByUsername(username);

            expect(result).toBeUndefined();
        });
    });

    describe('createUser', () => {
        it('should call the datasource to create a new user', async () => {
            await repository.createUser(username);

            expect(mockAuthDatasource.createUser).toHaveBeenCalledWith(username);
        });

        it('should return the created user as a mapped domain entity', async () => {
            const createdUser = { id: 1, username };
            mockAuthDatasource.createUser.mockResolvedValue(createdUser);

            const result = await repository.createUser(username);

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.id).toBe(createdUser.id);
            expect(result.username).toBe(createdUser.username);
        });
    });
});
