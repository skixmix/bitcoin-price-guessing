import cookies from 'js-cookie';
import { useAuthStore } from '../../../../common/stores/authentication.store';
import { ILocalAuthenticationDatasource } from './local-authentication.datasource.interface';

export class LocalAuthenticationDatasource implements ILocalAuthenticationDatasource {
    private readonly _AUTH_COOKIE_NAME = import.meta.env.AUTH_COOKIE_NAME ?? 'authToken';
    private readonly _COOKIE_OPTIONS: Cookies.CookieAttributes = { domain: window.location.hostname, path: '/' };

    setAuthCookie(token: string): void {
        cookies.set(this._AUTH_COOKIE_NAME, token, this._COOKIE_OPTIONS);
    }
    removeAuthCookie(): void {
        cookies.remove(this._AUTH_COOKIE_NAME, this._COOKIE_OPTIONS);
    }
    setLoggedInStore(): void {
        useAuthStore.getState().setAuthenticated(true);
    }
    setLoggedOutStore(): void {
        useAuthStore.getState().setAuthenticated(false);
    }
}
