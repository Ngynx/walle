import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AVLInputD } from '../points/dto/avl-input.dto';
import { AVLD } from '../points/dto/avl-output.dto';
import { AVLInputToAVLOutputMapper } from '../points/mappers/avl.mapper';
import { PointsTimescaleService } from './points-timescale.service';

@Controller()
export class KafkaPointsTimescaleController {
  private readonly logger = new Logger(KafkaPointsTimescaleController.name);

  constructor(private readonly pointsService: PointsTimescaleService) { }

  @MessagePattern('gps_devices_normal')
  async handleGpsData(@Payload() data: AVLInputD) {
    try {
      const payload = this.decodePayload(data);
      // console.log("payload: ", payload);
      if (!payload) return;

      const normalizedData = AVLInputToAVLOutputMapper.map(
        payload as unknown as AVLInputD,
      );

      if (!this.isValidNormalizedData(normalizedData)) return;

      await this.pointsService.create(normalizedData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Fallo crítico procesando mensaje Kafka: ${errorMessage}`,
      );
    }
  }

  private decodePayload(data: AVLInputD): Record<string, unknown> | null {
    const rawData = data as unknown as Record<string, unknown>;
    const payload = rawData?.value ?? data;

    if (payload && typeof payload === 'object' && !Buffer.isBuffer(payload)) {
      return payload as Record<string, unknown>;
    }

    if (Buffer.isBuffer(payload) || typeof payload === 'string') {
      try {
        return JSON.parse(payload.toString()) as Record<string, unknown>;
      } catch {
        this.logger.warn('Mensaje descartado: JSON inválido.');
        return null;
      }
    }

    this.logger.warn('Mensaje descartado: Formato de payload no soportado.');
    return null;
  }

  private isValidNormalizedData(data: AVLD): boolean {
    const {
      trackerDeviceImei,
      timestamp,
      trackerDeviceLatitude,
      trackerDeviceLongitude,
    } = data;

    if (!this.isPositiveNumber(trackerDeviceImei)) {
      this.logger.warn(
        `IMEI inválido descartado: ${String(trackerDeviceImei)}`,
      );
      return false;
    }

    if (!this.isPositiveNumber(timestamp)) {
      this.logger.warn(
        `Timestamp inválido descartado (IMEI: ${trackerDeviceImei})`,
      );
      return false;
    }

    if (
      !this.isValidLatitude(trackerDeviceLatitude) ||
      !this.isValidLongitude(trackerDeviceLongitude)
    ) {
      this.logger.warn(
        `Coordenadas fuera de rango descartadas (IMEI: ${trackerDeviceImei})`,
      );
      return false;
    }

    return true;
  }

  private isPositiveNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
  }

  private isValidLatitude(value: unknown): value is number {
    return (
      typeof value === 'number' &&
      Number.isFinite(value) &&
      value >= -90 &&
      value <= 90
    );
  }

  private isValidLongitude(value: unknown): value is number {
    return (
      typeof value === 'number' &&
      Number.isFinite(value) &&
      value >= -180 &&
      value <= 180
    );
  }
}
