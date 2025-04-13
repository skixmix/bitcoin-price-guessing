import { LocalAuthenticationDatasource } from '../datasources/local/local-authentication.datasource';
import { ILocalAuthenticationDatasource } from '../datasources/local/local-authentication.datasource.interface';
import { RemoteAuthenticationDatasource } from '../datasources/remote/remote-authentication.datasource';
import { IRemoteAuthenticationDatasource } from '../datasources/remote/remote-authentication.datasource.interface';
import { IAuthenticationRepository } from './authentication.repository.interface';

export class AuthenticationRepository implements IAuthenticationRepository {
    constructor(
        private readonly _remoteAuthDatasource: IRemoteAuthenticationDatasource = new RemoteAuthenticationDatasource(),
        private readonly _localAuthDatasource: ILocalAuthenticationDatasource = new LocalAuthenticationDatasource(),
    ) {}

    public async loginWithUsername(username: string): Promise<string> {
        const result = await this._remoteAuthDatasource.loginWithUsername(username);

        if (!result) {
            throw new Error('Authentication error!');
        }

        return result.token;
    }

    public setAuthenticationInStorage(token: string): void {
        this._localAuthDatasource.setAuthCookie(token);
        this._localAuthDatasource.setLoggedInStore();
    }

    public async logout(): Promise<void> {
        this._localAuthDatasource.removeAuthCookie();
        this._localAuthDatasource.setLoggedOutStore();
    }
}
