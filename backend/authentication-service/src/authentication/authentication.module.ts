import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationDatasource } from './datasources/authentication.datasource';
import { User } from './models/user.model';
import { AuthenticationRepository } from './repositories/authentication.repository';
import { AuthenticationService } from './services/authentication.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: `${config.get<string>('JWT_EXPIRATION_IN_DAYS')}d` },
            }),
        }),
    ],
    providers: [AuthenticationDatasource, AuthenticationRepository, AuthenticationService],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {}
