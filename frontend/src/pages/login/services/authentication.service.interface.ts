export interface IAuthenticationService {
    loginWithUsername(username: string): Promise<void>;
    logout(): void;
}
