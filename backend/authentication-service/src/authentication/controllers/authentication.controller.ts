import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDTO } from '../dtos/login-request.dto';
import { ILoginResponseDTO, LoginResponseDTO } from '../dtos/login-response.dto';
import { AuthenticationService } from '../services/authentication.service';
import { IAuthenticationService } from '../services/authentication.service.interface';

@Controller('login')
@ApiTags('Authentication')
export class AuthenticationController {
    constructor(
        @Inject(AuthenticationService)
        private readonly _authenticationService: IAuthenticationService,
        @Inject(JwtService)
        private readonly _jwtService: JwtService,
    ) {}

    @Post()
    @ApiResponse({
        status: HttpStatus.OK,
        type: LoginResponseDTO,
        description: 'User logged in successfully',
    })
    public async login(@Body() loginDTO: LoginRequestDTO): Promise<ILoginResponseDTO> {
        const username = loginDTO.username;

        const foundUserInStorage = await this._authenticationService.findOrCreateUser(username);
        const authenticationToken = this._jwtService.sign({
            username: foundUserInStorage.username,
        });

        return {
            token: authenticationToken,
        };
    }
}
