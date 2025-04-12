import { IUserEntity } from '../entities/user.entity';

export interface IAuthenticationService {
    findOrCreateUser(username: string): Promise<IUserEntity>;
}
