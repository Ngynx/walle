import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointTimescale } from './model/point-timescale.model';
import { PointsTimescaleController } from './points-timescale.controller';
import { KafkaPointsTimescaleController } from './kafka-points-timescale.controller';
import { PointsTimescaleService } from './points-timescale.service';
import { TimescaleBootstrapService } from './timescale-bootstrap.service';
import { TIMESCALE_CONNECTION_NAME } from '../../common/constants/database.constant';
import { PointGateway } from './gateway/point.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([PointTimescale], TIMESCALE_CONNECTION_NAME),
  ],
  controllers: [PointsTimescaleController, KafkaPointsTimescaleController],
  providers: [
    PointsTimescaleService,
    TimescaleBootstrapService,
    PointGateway
  ],
  exports: [TimescaleBootstrapService],
})
export class PointsTimescaleModule { }
