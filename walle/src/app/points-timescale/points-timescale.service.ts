import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePointDto } from '../points/dto/create-point.dto';
import { GetPointsQueryDto } from '../points/dto/get-points-query.dto';
import { PointTimescale } from './model/point-timescale.model';
import { TIMESCALE_CONNECTION_NAME } from '../../common/constants/database.constant';

type FindAllPointsResult = {
  data: PointTimescale[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

@Injectable()
export class PointsTimescaleService {
  private readonly logger = new Logger(PointsTimescaleService.name);

  constructor(
    @InjectRepository(PointTimescale, TIMESCALE_CONNECTION_NAME)
    private readonly pointsRepository: Repository<PointTimescale>,
  ) {}

  async create(createPointDto: CreatePointDto): Promise<PointTimescale | null> {
    const { trackerDeviceImei, timestamp, location } = createPointDto;

    if (!trackerDeviceImei) {
      this.logger.warn('Intento de guardar punto sin IMEI descartado.');
      return null;
    }

    // Soporta timestamp en segundos y milisegundos.
    let finalTimestamp = Number(timestamp);
    if (finalTimestamp < 100_000_000_000) {
      finalTimestamp *= 1000;
    }

    try {
      const insertResult = await this.pointsRepository
        .createQueryBuilder()
        .insert()
        .values({
          ...createPointDto,
          timestamp: finalTimestamp,
          location: location
            ? () => `ST_GeomFromText('${location}', 4326)`
            : undefined,
        })
        .orIgnore() // Evita error por duplicados (imei + timestamp).
        .returning('*')
        .execute();

      if (insertResult.generatedMaps.length === 0) {
        return null;
      }

      return insertResult.generatedMaps[0] as PointTimescale;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error persistiendo punto en TimescaleDB para IMEI ${trackerDeviceImei}: ${errorMessage}`,
      );
      throw error;
    }
  }

  async findAll(query: GetPointsQueryDto): Promise<FindAllPointsResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.pointsRepository.findAndCount({
      order: { timestamp: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
