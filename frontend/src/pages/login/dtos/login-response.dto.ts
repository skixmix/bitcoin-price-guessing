export interface ILoginResponseDTO {
    token: string;
}

export class LoginResponseDTO implements ILoginResponseDTO {
    token: string;

    constructor(data: Readonly<ILoginResponseDTO>) {
        this.token = data.token;
    }
}
