import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Este DTO representa la data cruda tal cual viene de Kafka.
 * Es "flexible" porque incluimos todos los nombres posibles de campos
 * (ej. Alt y Altitud) para que la validación no falle.
 */
export class AVLInputD {
  @IsOptional()
  @IsNumber()
  Imei: number;

  @IsOptional()
  @IsNumber()
  imei?: number;

  @IsOptional()
  @IsNumber()
  Lat: number;

  @IsOptional()
  @IsNumber()
  Lng: number;

  // Normalización: Soportamos ambos nombres
  @IsOptional()
  @IsNumber()
  Alt?: number;

  @IsOptional()
  @IsNumber()
  Altitud?: number;

  @IsOptional()
  @IsNumber()
  Angle: number;

  @IsOptional()
  @IsNumber()
  PacketId: number;

  @IsOptional()
  @IsNumber()
  CodecId: number;

  @IsOptional()
  @IsString()
  ShippingDate: string;

  @IsOptional()
  @IsNumber()
  SpeedMs: number;

  @IsOptional()
  @IsNumber()
  Status: number;

  @IsOptional()
  @IsNumber()
  Accuracy: number;

  // Normalización: Soportamos ambos nombres
  @IsOptional()
  @IsNumber()
  Battery?: number;

  @IsOptional()
  @IsNumber()
  BatteryLevel?: number;

  @IsOptional()
  @IsNumber()
  Speed: number;

  @IsOptional()
  @IsNumber()
  Timestamp: number;

  @IsOptional()
  @IsBoolean()
  Ignition: boolean;

  @IsOptional()
  @IsNumber()
  GsmSignal: number;

  @IsOptional()
  @IsNumber()
  Distance: number;

  @IsOptional()
  @IsNumber()
  TotalDistance: number;

  @IsOptional()
  @IsNumber()
  EngineHours: number;

  @IsOptional()
  @IsNumber()
  EngineTotalHours: number;

  @IsOptional()
  @IsString()
  Alarm: string;

  @IsOptional()
  @IsBoolean()
  Movement: boolean;

  @IsOptional()
  @IsNumber()
  GnssState: number;

  @IsOptional()
  @IsNumber()
  NumberOfSatellites: number;

  @IsOptional()
  @IsNumber()
  ExternalVoltage: number;

  @IsOptional()
  @IsNumber()
  AccuracyGnssPdop: number;

  @IsOptional()
  @IsNumber()
  AccuracyGnssHdop: number;

  @IsOptional()
  @IsNumber()
  DataMode?: number;

  @IsOptional()
  @IsNumber()
  NetworkType?: number;

  @IsOptional()
  @IsNumber()
  GsmAreaCode?: number;

  @IsOptional()
  @IsNumber()
  BatteryCurrentAmps?: number;

  @IsOptional()
  @IsNumber()
  ActiveGsmOperator?: number;

  @IsOptional()
  @IsNumber()
  CellId?: number;
}
