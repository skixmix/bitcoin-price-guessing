import { Inject, Injectable } from '@nestjs/common';
import { IUserEntity } from '../entities/user.entity';
import { AuthenticationRepository } from '../repositories/authentication.repository';
import { IAuthenticationRepository } from '../repositories/authentication.repository.interface';
import { IAuthenticationService } from './authentication.service.interface';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
    constructor(
        @Inject(AuthenticationRepository)
        private readonly _authenticationRepository: IAuthenticationRepository,
    ) {}

    public async findOrCreateUser(username: string): Promise<IUserEntity> {
        const foundUser = await this._authenticationRepository.findUserByUsername(username);

        if (foundUser) {
            return foundUser;
        }

        const createdUser = await this._authenticationRepository.createUser(username);
        return createdUser;
    }
}
