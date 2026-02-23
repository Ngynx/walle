import {
  Controller,
  Get,
  MethodNotAllowedException,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GetPointsQueryDto } from '../points/dto/get-points-query.dto';
import { PointsTimescaleService } from './points-timescale.service';

@Controller('points')
export class PointsTimescaleController {
  constructor(private readonly pointsService: PointsTimescaleService) {}

  @Post()
  create() {
    throw new MethodNotAllowedException(
      'La ingestión por REST está deshabilitada. Use Kafka topic gps_raw.',
    );
  }

  @Get()
  async findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: GetPointsQueryDto,
  ) {
    return this.pointsService.findAll(query);
  }
}
