import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, Table, TableColumn } from "typeorm";
import { startOfDayMs, toDateStr } from "./helpers/dates.helper";
import { Cron } from "@nestjs/schedule";
import { Point } from "./model/point.model";
import { CREATE_POINTS_PARENT_TABLE } from "../database/constants/points.sql";

@Injectable()
export class PartitionManagerService {
  private readonly logger = new Logger(PartitionManagerService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) { }

  // ─── Crea la tabla padre particionada (ejecutar una sola vez en bootstrap) ───
  async createParentTableIfNotExists(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const parentExists = await queryRunner.hasTable('points');

      if (parentExists) {
        this.logger.log('Parent table already exists. Skipping.');
        return;
      }

      // Crear directamente la tabla particionada con SQL
      await queryRunner.query(CREATE_POINTS_PARENT_TABLE);

      this.logger.log('Partitioned parent table points created.');

    } catch (error) {
      this.logger.error('Failed to create partitioned parent table:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  // ─── Crea una partición para una fecha dada ───────────────────────────────────
  async createPartitionForDate(date: Date): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const tableName = this.buildPartitionName(date);
      const tsStart = startOfDayMs(date);
      const tsEnd = tsStart + 86_400_000;

      const partitionExists = await queryRunner.hasTable(tableName);
      if (partitionExists) {
        this.logger.log(`Partition ${tableName} already exists. Skipping.`);
        return;
      }

      await queryRunner.query(`
        CREATE TABLE ${tableName}
          PARTITION OF points
          FOR VALUES FROM (${tsStart}) TO (${tsEnd})
      `);

      await queryRunner.query(`
        CREATE INDEX idx_${tableName}_timestamp
          ON ${tableName} (timestamp)
      `);

      await queryRunner.query(`
        CREATE INDEX idx_${tableName}_imei_ts
          ON ${tableName} (tracker_device_imei, timestamp)
      `);

      await queryRunner.query(`
        CREATE INDEX idx_${tableName}_imei_ts_trip
          ON ${tableName} (tracker_device_imei, timestamp, tracker_device_trip_id)
      `);

      await queryRunner.query(`
        CREATE INDEX idx_${tableName}_location
          ON ${tableName} USING GIST (location)
      `);

      this.logger.log(`Partition ${tableName} created with all indexes.`);
    } catch (error) {
      this.logger.error(`Failed to create partition for ${date.toISOString()}`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ─── Elimina una partición de hace N días ─────────────────────────────────────
  async dropPartitionDaysAgo(daysAgo: number): Promise<void> {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const tableName = `points_${toDateStr(date)}`;

    await this.dataSource.query(`DROP TABLE IF EXISTS ${tableName}`);
    this.logger.log(`Partition ${tableName} dropped.`);
  };

  private buildPartitionName(date: Date): string {
    return `points_${toDateStr(date)}`;
  }

  // ─── Jobs programados ─────────────────────────────────────────────────────────

  @Cron('50 23 * * *') // Cada día a las 23:50 → crea partición de mañana
  async scheduleNextDay(): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await this.createPartitionForDate(tomorrow);
  };

  // @Cron('5 0 * * *')  // Cada día a las 00:05 → elimina partición de ayer
  // async cleanYesterday(): Promise<void> {
  //     await this.dropPartitionDaysAgo(1);
  // }
}