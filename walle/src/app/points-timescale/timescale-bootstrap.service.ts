import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  buildCreatePointsTimescaleHypertableSql,
  buildPointsTimescaleCompressionPolicySql,
  buildPointsTimescaleRetentionPolicySql,
  CREATE_POINTS_TIMESCALE_INDEXES_SQL,
  CREATE_POINTS_TIMESCALE_TABLE,
  CREATE_TIMESCALE_EXTENSIONS_SQL,
  ENABLE_POINTS_TIMESCALE_COMPRESSION_SQL,
  REMOVE_POINTS_TIMESCALE_COMPRESSION_POLICY_SQL,
  REMOVE_POINTS_TIMESCALE_RETENTION_POLICY_SQL,
} from '../database/constants/points-timescale.sql';
import { TIMESCALE_CONNECTION_NAME } from '../../common/constants/database.constant';

@Injectable()
export class TimescaleBootstrapService {
  private readonly logger = new Logger(TimescaleBootstrapService.name);

  constructor(
    @InjectDataSource(TIMESCALE_CONNECTION_NAME)
    private readonly dataSource: DataSource,
  ) {}

  async bootstrap(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // 1) Extensiones base para Timescale + PostGIS.
      for (const query of CREATE_TIMESCALE_EXTENSIONS_SQL) {
        await queryRunner.query(query);
      }

      // 2) Esquema e hypertable.
      await queryRunner.query(CREATE_POINTS_TIMESCALE_TABLE);
      await queryRunner.query(
        buildCreatePointsTimescaleHypertableSql(
          this.getPositiveIntEnv('TIMESCALE_CHUNK_MS', 86_400_000),
        ),
      );

      // 3) Indices de rendimiento y deduplicacion.
      for (const query of CREATE_POINTS_TIMESCALE_INDEXES_SQL) {
        await queryRunner.query(query);
      }

      // 4) Compresion opcional por politica.
      const compressionEnabled = this.getBooleanEnv(
        'TIMESCALE_ENABLE_COMPRESSION',
        true,
      );
      if (compressionEnabled) {
        await queryRunner.query(ENABLE_POINTS_TIMESCALE_COMPRESSION_SQL);
        await queryRunner.query(
          buildPointsTimescaleCompressionPolicySql(
            this.daysToMilliseconds(
              this.getPositiveIntEnv('TIMESCALE_COMPRESSION_AFTER_DAYS', 1),
            ),
          ),
        );
      } else {
        await queryRunner.query(REMOVE_POINTS_TIMESCALE_COMPRESSION_POLICY_SQL);
      }

      // 5) Retencion opcional. Si esta desactivada, la data persiste indefinidamente.
      const retentionEnabled = this.getBooleanEnv(
        'TIMESCALE_ENABLE_RETENTION',
        false,
      );
      if (retentionEnabled) {
        await queryRunner.query(
          buildPointsTimescaleRetentionPolicySql(
            this.daysToMilliseconds(
              this.getPositiveIntEnv('TIMESCALE_RETENTION_DAYS', 90),
            ),
          ),
        );
      } else {
        await queryRunner.query(REMOVE_POINTS_TIMESCALE_RETENTION_POLICY_SQL);
      }

      this.logger.log(
        'TimescaleDB bootstrap completado para points_timescale.',
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Fallo en bootstrap de TimescaleDB: ${errorMessage}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private getPositiveIntEnv(key: string, defaultValue: number): number {
    const parsedValue = Number(process.env[key] ?? defaultValue);
    return Number.isInteger(parsedValue) && parsedValue > 0
      ? parsedValue
      : defaultValue;
  }

  private getBooleanEnv(key: string, defaultValue: boolean): boolean {
    const rawValue = process.env[key];
    if (rawValue === undefined) {
      return defaultValue;
    }

    return rawValue.toLowerCase() === 'true';
  }

  private daysToMilliseconds(days: number): number {
    // Convierte dias a milisegundos para hypertables con tiempo BIGINT.
    return days * 86_400_000;
  }
}
