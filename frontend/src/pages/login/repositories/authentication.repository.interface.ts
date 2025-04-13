export interface IAuthenticationRepository {
    loginWithUsername(username: string): Promise<string>;
    logout(): Promise<void>;
    setAuthenticationInStorage(token: string): void;
}
