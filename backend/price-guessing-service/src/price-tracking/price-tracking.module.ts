import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../utils/guards/authentication.guard';
import { PriceController } from './controllers/price.controller';
import { PriceDatasource } from './datasources/price.datasource';
import { Price } from './models/price.model';
import { PriceRepository } from './repositories/price.repository';
import { PriceService } from './services/price.service';

@Module({
    imports: [TypeOrmModule.forFeature([Price])],
    providers: [JwtAuthGuard, PriceDatasource, PriceRepository, PriceService],
    controllers: [PriceController],
    exports: [PriceService],
})
export class PriceTrackingModule {}
