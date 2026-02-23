import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './model/point.model';
import { PartitionManagerService } from './partition-manager.service';
import { PointsController } from './points.controller';
import { KafkaPointsController } from './kafka-points.controller';
import { PointsService } from './points.service';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  controllers: [PointsController, KafkaPointsController],
  providers: [PointsService, PartitionManagerService],
  exports: [PartitionManagerService],
})
export class PointsModule { }
