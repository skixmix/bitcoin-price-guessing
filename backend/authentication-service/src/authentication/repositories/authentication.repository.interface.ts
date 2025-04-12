import { IUserEntity } from '../entities/user.entity';

export interface IAuthenticationRepository {
    findUserByUsername(username: string): Promise<IUserEntity | undefined>;
    createUser(username: string): Promise<IUserEntity>;
}
