import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuessingModule } from './guessing/guessing.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { PriceTrackingModule } from './price-tracking/price-tracking.module';
import { ScoringModule } from './scoring/scoring.module';

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

const jwtModule = JwtModule.registerAsync({
    global: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
    }),
});

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        databaseConnectionModule,
        jwtModule,
        HealthCheckModule,
        GuessingModule,
        ScoringModule,
        PriceTrackingModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
