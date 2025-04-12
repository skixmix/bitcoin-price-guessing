import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../guards/authentication.guard';
import { ScoreController } from './controllers/score.controller';
import { ScoreDatasource } from './datasources/score.datasource';
import { Score } from './models/score.model';
import { ScoreRepository } from './repositories/score.repository';
import { ScoreService } from './services/score.service';

@Module({
    imports: [TypeOrmModule.forFeature([Score])],
    providers: [JwtAuthGuard, ScoreDatasource, ScoreRepository, ScoreService],
    controllers: [ScoreController],
})
export class ScoringModule {}
