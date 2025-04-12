import { User } from '../models/user.model';

export interface IAuthenticationDatasource {
    findUserByUsername(username: string): Promise<User | null>;
    createUser(username: string): Promise<User>;
}
