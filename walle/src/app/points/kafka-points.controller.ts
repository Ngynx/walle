import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AVLInputD } from './dto/avl-input.dto';
import { AVLD } from './dto/avl-output.dto';
import { AVLInputToAVLOutputMapper } from './mappers/avl.mapper';
import { PointsService } from './points.service';

@Controller()
export class KafkaPointsController {
  private readonly logger = new Logger(KafkaPointsController.name);

  constructor(private readonly pointsService: PointsService) {}

  @MessagePattern('gps_raw')
  async handleGpsData(@Payload() data: AVLInputD) {
    try {
      const payload = this.decodePayload(data);
      if (!payload) return;

      // Mapeo y normalización (Case-insensitive, unidades coherentes)
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

  /**
   * Extrae el objeto JSON del mensaje Kafka soportando Buffer o string.
   */
  private decodePayload(data: AVLInputD): Record<string, unknown> | null {
    // Intentamos extraer el 'value' si viene en el formato envuelto de Nest Kafka.
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

  /**
   * Validaciones mínimas de integridad antes de persistir.
   */
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
