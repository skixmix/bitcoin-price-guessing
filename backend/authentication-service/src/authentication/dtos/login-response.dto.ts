import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export interface ILoginResponseDTO {
    token: string;
}

export class LoginResponseDTO implements ILoginResponseDTO {
    @Expose()
    @ApiProperty({
        description: 'The authentication token',
    })
    token: string;
}
