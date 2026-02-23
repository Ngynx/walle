import {
  Controller,
  Get,
  MethodNotAllowedException,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GetPointsQueryDto } from './dto/get-points-query.dto';
import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  create() {
    // La ingesta operativa va solo por Kafka para mantener un único flujo de validación.
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
