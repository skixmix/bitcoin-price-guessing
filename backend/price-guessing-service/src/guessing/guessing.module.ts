import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceTrackingModule } from '../price-tracking/price-tracking.module';
import { JwtAuthGuard } from '../utils/guards/authentication.guard';
import { GuessController } from './controllers/guess.controller';
import { GuessDatasource } from './datasources/guess.datasource';
import { Guess } from './models/guess.model';
import { GuessRepository } from './repositories/guess.repository';
import { GuessService } from './services/guess.service';

@Module({
    imports: [TypeOrmModule.forFeature([Guess]), PriceTrackingModule],
    providers: [JwtAuthGuard, GuessDatasource, GuessRepository, GuessService],
    controllers: [GuessController],
})
export class GuessingModule {}
