import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class AVLD {
  @IsNumber()
  trackerDeviceImei: number;

  @IsNumber()
  trackerDeviceLatitude: number;

  @IsNumber()
  trackerDeviceLongitude: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceAltitude?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceAngle?: number;

  @IsNumber()
  @IsOptional()
  trackerDevicePacketId?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceCodecId?: number;

  @IsString()
  @IsOptional()
  trackerDeviceShippingDate?: string;

  @IsNumber()
  @IsOptional()
  trackerDeviceSpeedMs?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceStatus?: number;

  @IsNumber()
  @IsOptional()
  trackerAccuracy?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceBattery?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceSpeedKh?: number;

  @IsNumber()
  timestamp: number;

  @IsBoolean()
  @IsOptional()
  trackerDeviceIgnition?: boolean;

  @IsNumber()
  @IsOptional()
  trackerDeviceGsmSignal?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceDistance?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceTotalDistance?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceEngineHours?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceTotalEngineHours?: number;

  @IsString()
  @IsOptional()
  trackerDeviceAlarm?: string;

  @IsBoolean()
  @IsOptional()
  trackerDeviceMovement?: boolean;

  @IsNumber()
  @IsOptional()
  trackerDeviceGnssState?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceNumberOfSatellites?: number;

  @IsString()
  @IsOptional()
  trackerDeviceGeocode?: string;

  @IsString()
  @IsOptional()
  trackerDeviceIdMunicipality?: string;

  @IsString()
  @IsOptional()
  trackerDeviceLicensePlate?: string;

  @IsString()
  @IsOptional()
  trackerPlotUuid?: string;

  @IsNumber()
  @IsOptional()
  trackerDeviceGnssPdop?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceGnssHdop?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceDataMode?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceNetworkType?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceGsmAreaCode?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceBatteryCurrentAmps?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceActiveGsmOperator?: number;

  @IsNumber()
  @IsOptional()
  trackerDeviceCellId?: number;

  @IsBoolean()
  @IsOptional()
  trackerDeviceInsideGeofence?: boolean;

  @IsBoolean()
  @IsOptional()
  trackerDeviceInsideQuadrant?: boolean;

  @IsOptional()
  trackerDeviceQuadrant?: {
    areaId: any;
    areaName: string;
    quadrantId: string;
    quadrantName: string;
  } | null;

  @IsString()
  @IsOptional()
  location?: string;
}
