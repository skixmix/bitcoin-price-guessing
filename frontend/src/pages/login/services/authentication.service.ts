import { AuthenticationRepository } from '../repositories/authentication.repository';
import { IAuthenticationRepository } from '../repositories/authentication.repository.interface';
import { IAuthenticationService } from './authentication.service.interface';

export class AuthenticationService implements IAuthenticationService {
    constructor(
        private readonly _authenticationRepository: IAuthenticationRepository = new AuthenticationRepository(),
    ) {}

    public async loginWithUsername(username: string): Promise<void> {
        const obtainedToken = await this._authenticationRepository.loginWithUsername(username);
        this._authenticationRepository.setAuthenticationInStorage(obtainedToken);
    }

    logout(): void {
        this._authenticationRepository.logout();
    }
}
