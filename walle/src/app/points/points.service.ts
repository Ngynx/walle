import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { toDateStr } from './helpers/dates.helper';
import { CreatePointDto } from './dto/create-point.dto';
import { GetPointsQueryDto } from './dto/get-points-query.dto';
import { Point } from './model/point.model';
import { PartitionManagerService } from './partition-manager.service';

type FindAllPointsResult = {
  data: Point[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

@Injectable()
export class PointsService {
  private readonly logger = new Logger(PointsService.name);
  // Cache local de particiones ya verificadas para no consultar lo mismo en cada mensaje.
  private readonly ensuredPartitions = new Set<string>();
  // Evita crear la misma particion en paralelo cuando llegan muchos mensajes al mismo tiempo.
  private readonly partitionCreationInFlight = new Map<string, Promise<void>>();

  constructor(
    @InjectRepository(Point)
    private readonly pointsRepository: Repository<Point>,
    private readonly partitionManagerService: PartitionManagerService,
  ) { }

  /**
   * Persiste un punto en la base de datos de manera inmediata.
   * Incluye seguridad contra duplicados (Deduplicación).
   */
  async create(createPointDto: CreatePointDto): Promise<Point | null> {
    const { trackerDeviceImei, timestamp, location } = createPointDto;

    if (!trackerDeviceImei) {
      this.logger.warn('Intento de guardar punto sin IMEI descartado.');
      return null;
    }

    // Normaliza timestamps (soportamos seg y ms).
    let finalTimestamp = Number(timestamp);
    if (finalTimestamp < 100_000_000_000) {
      finalTimestamp *= 1000;
    }

    const date = new Date(finalTimestamp);
    await this.ensurePartitionForDate(date);

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
        .orIgnore() // Deduplicación: Si el punto ya existe (IMEI + Timestamp), no falla.
        .returning('*')
        .execute();

      // console.log("insertResult: ", insertResult);
      // //** SOCKET */
      // if (avlNewDocument) {
      //   this.avlGateway.handleEvent(insertResult);
      // };

      if (insertResult.generatedMaps.length === 0) {
        return null; // El punto era un duplicado y fue ignorado por orIgnore()
      }

      return insertResult.generatedMaps[0] as Point;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error persistiendo punto para IMEI ${trackerDeviceImei}: ${errorMessage}`,
      );
      throw error;
    }
  }

  private async ensurePartitionForDate(date: Date): Promise<void> {
    const partitionKey = toDateStr(date);
    if (this.ensuredPartitions.has(partitionKey)) {
      return;
    }

    const existingTask = this.partitionCreationInFlight.get(partitionKey);
    if (existingTask) {
      await existingTask;
      return;
    }

    const createTask = (async () => {
      try {
        await this.partitionManagerService.createPartitionForDate(date);
        this.ensuredPartitions.add(partitionKey);
      } finally {
        // Siempre limpia el lock en memoria para permitir futuros reintentos.
        this.partitionCreationInFlight.delete(partitionKey);
      }
    })();

    this.partitionCreationInFlight.set(partitionKey, createTask);
    await createTask;
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
