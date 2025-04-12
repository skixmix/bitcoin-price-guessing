import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { IFastifyRequestWithUserId } from './authentication.guard.interface';

interface IDecodedToken {
    userId: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @Inject(JwtService)
        private readonly _jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<IFastifyRequestWithUserId>();

        try {
            const tokenFromCookies = this._extractTokenFromCookies(request);

            if (!tokenFromCookies) {
                throw new UnauthorizedException('Authentication token is missing!');
            }
            const decodedToken = this._verifyAndDecodeOrThrow(tokenFromCookies);
            request.userId = decodedToken.userId;
            return true;
        } catch (error) {
            console.error('Error during cookie parsing for authentication', error);
        }

        throw new UnauthorizedException();
    }

    private _extractTokenFromCookies(request: FastifyRequest): string | undefined {
        const requestWithCookies = request as unknown as { cookies: Record<string, string> };
        const requestCookies = requestWithCookies?.cookies;
        if (!requestCookies) {
            return;
        }

        const authenticationCookieValue = requestCookies[process.env.AUTH_COOKIE_NAME];
        return authenticationCookieValue;
    }

    private _verifyAndDecodeOrThrow(token: string): IDecodedToken {
        return this._jwtService.verify(token);
    }
}
