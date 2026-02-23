import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreatePointDto {
  @IsInt()
  timestamp: number;

  @IsNumber()
  trackerDeviceImei: number;

  @IsNumber()
  trackerDeviceLatitude: number;

  @IsNumber()
  trackerDeviceLongitude: number;

  @IsOptional()
  @IsString()
  @Matches(/^POINT\(\s*-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?\s*\)$/i, {
    message: 'location must use WKT format: POINT(longitude latitude)',
  })
  location?: string;

  // --- Campos Adicionales para Kafka / Telemetría Extendida ---
  @IsOptional()
  @IsNumber()
  trackerDeviceAltitude?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceAngle?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceSpeedMs?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceSpeedKh?: number;

  @IsOptional()
  @IsBoolean()
  trackerDeviceMovement?: boolean;

  @IsOptional()
  @IsBoolean()
  trackerDeviceIgnition?: boolean;

  @IsOptional()
  @IsNumber()
  trackerDeviceDistance?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceTotalDistance?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceEngineHours?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceTotalEngineHours?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceGsmSignal?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceBattery?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceBatteryCurrentAmps?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceStatus?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceDataMode?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceNetworkType?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceGsmAreaCode?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceActiveGsmOperator?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceCellId?: number;

  @IsOptional()
  @IsNumber()
  trackerDevicePacketId?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceCodecId?: number;

  @IsOptional()
  @IsNumber()
  trackerAccuracy?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceGnssState?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceNumberOfSatellites?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceGnssPdop?: number;

  @IsOptional()
  @IsNumber()
  trackerDeviceGnssHdop?: number;

  @IsOptional()
  @IsString()
  trackerDeviceGeocode?: string;

  @IsOptional()
  @IsString()
  trackerDeviceIdMunicipality?: string;

  @IsOptional()
  @IsString()
  trackerPlotUuid?: string;

  @IsOptional()
  @IsBoolean()
  trackerDeviceInsideGeofence?: boolean;

  @IsOptional()
  @IsBoolean()
  trackerDeviceInsideQuadrant?: boolean;

  @IsOptional()
  trackerDeviceQuadrant?: any;

  @IsOptional()
  @IsString()
  trackerDeviceAlarm?: string;

  @IsOptional()
  @IsString()
  trackerDeviceLicensePlate?: string;

  @IsOptional()
  @IsString()
  trackerDeviceShippingDate?: string;
}
