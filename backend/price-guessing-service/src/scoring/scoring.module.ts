import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../guards/authentication.guard';

import { Score } from './models/score.model';

@Module({
    imports: [TypeOrmModule.forFeature([Score])],
    providers: [JwtAuthGuard],
    controllers: [],
})
export class ScoringModule {}
