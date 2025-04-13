export interface ILocalAuthenticationDatasource {
    setAuthCookie(token: string): void;
    removeAuthCookie(): void;

    setLoggedInStore(): void;
    setLoggedOutStore(): void;
}
