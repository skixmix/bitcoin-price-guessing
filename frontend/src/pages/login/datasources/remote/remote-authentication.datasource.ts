import { AxiosInstance } from 'axios';
import axiosInstance from '../../../../common/axios-instance/axios-instance';
import { ILoginResponseDTO } from '../../dtos/login-response.dto';
import { IRemoteAuthenticationDatasource } from './remote-authentication.datasource.interface';

export class RemoteAuthenticationDatasource implements IRemoteAuthenticationDatasource {
    private readonly _AUTHENTICATION_URL = '/auth/login';

    constructor(private readonly _axiosInstance: AxiosInstance = axiosInstance) {}

    public async loginWithUsername(username: string): Promise<ILoginResponseDTO> {
        const response = await this._axiosInstance.post<ILoginResponseDTO>(this._AUTHENTICATION_URL, { username });
        return response.data;
    }
}
