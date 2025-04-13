import { AuthenticationService } from './authentication.service';
import { IAuthenticationService } from './authentication.service.interface';

export const authenticationServiceInstance: IAuthenticationService = new AuthenticationService();
