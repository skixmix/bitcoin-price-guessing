import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export interface ILoginRequestDTO {
    username: string;
}

export class LoginRequestDTO implements ILoginRequestDTO {
    @IsString()
    @ApiProperty({
        description: 'The username of the user',
        example: 'johndoe',
    })
    username!: string;
}
