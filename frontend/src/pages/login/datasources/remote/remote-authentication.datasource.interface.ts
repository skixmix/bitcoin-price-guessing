import { ILoginResponseDTO } from '../../dtos/login-response.dto';

export interface IRemoteAuthenticationDatasource {
    loginWithUsername(username: string): Promise<ILoginResponseDTO>;
}
