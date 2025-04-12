import { Repository } from 'typeorm';
import { User } from '../models/user.model';
import { AuthenticationDatasource } from './authentication.datasource';
import { IAuthenticationDatasource } from './authentication.datasource.interface';

describe('AuthenticationDatasource', () => {
    let datasource: IAuthenticationDatasource;
    let mockUserDatabaseRepository: jest.Mocked<Repository<User>>;

    const username = 'testuser';
    const createdUser = new User();

    beforeEach(() => {
        mockUserDatabaseRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
        } as unknown as jest.Mocked<Repository<User>>;

        datasource = new AuthenticationDatasource(mockUserDatabaseRepository);

        createdUser.username = username;
        mockUserDatabaseRepository.create.mockReturnValue(createdUser);
        mockUserDatabaseRepository.save.mockResolvedValue(createdUser);
        mockUserDatabaseRepository.findOne.mockResolvedValue(createdUser);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('findUserByUsername', () => {
        it('should call the repository to find a user by username', async () => {
            await datasource.findUserByUsername(username);

            expect(mockUserDatabaseRepository.findOne).toHaveBeenCalledWith({ where: { username } });
        });

        it('should find a user by username', async () => {
            const result = await datasource.findUserByUsername(username);

            expect(result).toBe(createdUser);
        });

        it('should return null if the user was not found', async () => {
            mockUserDatabaseRepository.findOne.mockResolvedValue(null);

            const result = await datasource.findUserByUsername(username);

            expect(result).toBeNull();
        });
    });

    describe('createUser', () => {
        it('should call the repository to create a new user', async () => {
            await datasource.createUser(username);

            expect(mockUserDatabaseRepository.create).toHaveBeenCalledWith({ username });
            expect(mockUserDatabaseRepository.save).toHaveBeenCalledWith(createdUser);
        });

        it('should return the created user', async () => {
            const result = await datasource.createUser(username);

            expect(result).toBe(createdUser);
        });
    });
});
