import axios, { HttpStatusCode } from 'axios';
import { priceServiceInstance } from '../../pages/home/services/price/price.service.instance';
import { scoreServiceInstance } from '../../pages/home/services/score/score.service.instance';
import { LocalAuthenticationDatasource } from '../../pages/login/datasources/local/local-authentication.datasource';
import { ILocalAuthenticationDatasource } from '../../pages/login/datasources/local/local-authentication.datasource.interface';

const localAuthenticationDatasource: ILocalAuthenticationDatasource = new LocalAuthenticationDatasource();

const axiosInstance = axios.create({
    baseURL: '/',
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === HttpStatusCode.Unauthorized) {
            priceServiceInstance.stopStreaming();
            scoreServiceInstance.stopStreaming();

            localAuthenticationDatasource.removeAuthCookie();
            localAuthenticationDatasource.setLoggedOutStore();
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
