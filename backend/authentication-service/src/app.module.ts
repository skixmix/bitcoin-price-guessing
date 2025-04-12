import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { HealthCheckModule } from './health-check/health-check.module';

const databaseConnectionModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
    }),
});

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        databaseConnectionModule,
        HealthCheckModule,
        AuthenticationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
