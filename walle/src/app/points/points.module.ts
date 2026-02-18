import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './model/point.model';
import { PartitionManagerService } from './partition-manager.service';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([Point]),
    ],
    controllers: [PointsController],
    providers: [PointsService, PartitionManagerService],
    exports: [PartitionManagerService],
})
export class PointsModule { }
