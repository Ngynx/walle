import { Entity, Column, Index, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ValueTransformer } from 'typeorm';

/** Convierte el string que devuelve pg para bigint → number de JS */
const bigintTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string | number | null) =>
    value !== null && value !== undefined ? Number(value) : null,
};

@Entity({ name: 'points_timescale', synchronize: false })
@Index(['trackerDeviceImei', 'timestamp'], { unique: true })
export class PointTimescale {
  // Mantiene la PK compuesta para paridad funcional con el esquema legacy.
  /**
   * Incluye timestamp para conservar reglas de unicidad temporal.
   */
  @PrimaryColumn({
    type: 'uuid',
    name: 'id',
    default: () => 'gen_random_uuid()',
  })
  id: string;

  @PrimaryColumn({ type: 'bigint', name: 'timestamp', transformer: bigintTransformer })
  timestamp: number;

  @Column({ type: 'bigint', name: 'tracker_device_imei', transformer: bigintTransformer })
  trackerDeviceImei: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'tracker_device_license_plate',
  })
  trackerDeviceLicensePlate: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'tracker_device_alias',
  })
  trackerDeviceAlias: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
    name: 'location',
  })
  location: string;

  @Column({ type: 'double precision', name: 'tracker_device_latitude' })
  trackerDeviceLatitude: number;

  @Column({ type: 'double precision', name: 'tracker_device_longitude' })
  trackerDeviceLongitude: number;

  @Column({
    type: 'double precision',
    nullable: true,
    name: 'tracker_device_altitude',
  })
  trackerDeviceAltitude: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
    name: 'tracker_device_shipping_date',
  })
  trackerDeviceShippingDate: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'smallint', nullable: true, name: 'tracker_device_angle' })
  trackerDeviceAngle: number;

  @Column({ type: 'real', default: 0, name: 'tracker_device_speed_ms' })
  trackerDeviceSpeedMs: number;

  @Column({ type: 'real', default: 0, name: 'tracker_device_speed_kh' })
  trackerDeviceSpeedKh: number;

  @Column({ type: 'boolean', default: false, name: 'tracker_device_movement' })
  trackerDeviceMovement: boolean;

  @Column({ type: 'boolean', default: false, name: 'tracker_device_ignition' })
  trackerDeviceIgnition: boolean;

  @Column({
    type: 'double precision',
    default: 0,
    name: 'tracker_device_distance',
  })
  trackerDeviceDistance: number;

  @Column({
    type: 'double precision',
    default: 0,
    name: 'tracker_device_total_distance',
  })
  trackerDeviceTotalDistance: number;

  @Column({ type: 'real', default: 0, name: 'tracker_device_km_day' })
  trackerDeviceKmDay: number;

  @Column({
    type: 'real',
    default: 0,
    name: 'tracker_device_jurisdiction_km_day',
  })
  trackerDeviceJurisdictionKmDay: number;

  @Column({
    type: 'real',
    default: 0,
    name: 'tracker_device_no_jurisdiction_km_day',
  })
  trackerDeviceNoJurisdictionKmDay: number;

  @Column({
    type: 'integer',
    default: 0,
    name: 'tracker_device_driving_time_in_jurisdiction',
  })
  trackerDeviceDrivingTimeInJurisdiction: number;

  @Column({
    type: 'integer',
    default: 0,
    name: 'tracker_device_driving_time_out_of_jurisdiction',
  })
  trackerDeviceDrivingTimeOutOfJurisdiction: number;

  @Column({
    type: 'integer',
    default: 0,
    name: 'tracker_device_parking_time_in_jurisdiction',
  })
  trackerDeviceParkingTimeInJurisdiction: number;

  @Column({
    type: 'integer',
    default: 0,
    name: 'tracker_device_parking_time_out_of_jurisdiction',
  })
  trackerDeviceParkingTimeOutOfJurisdiction: number;

  @Column({
    type: 'integer',
    default: 0,
    name: 'tracker_device_tactical_parking',
  })
  trackerDeviceTacticalParking: number;

  @Column({ type: 'real', default: 0, name: 'tracker_device_engine_hours' })
  trackerDeviceEngineHours: number;

  @Column({
    type: 'real',
    default: 0,
    name: 'tracker_device_total_engine_hours',
  })
  trackerDeviceTotalEngineHours: number;

  @Column({
    type: 'real',
    default: 0,
    name: 'tracker_device_engine_hours_based_on_ignition',
  })
  trackerDeviceEngineHoursBasedOnIgnition: number;

  @Column({
    type: 'real',
    default: 0,
    name: 'tracker_device_engine_hours_based_on_ignition_and_stopped',
  })
  trackerDeviceEngineHoursBasedOnIgnitionAndStopped: number;

  @Column({
    type: 'smallint',
    nullable: true,
    name: 'tracker_device_gsm_signal',
  })
  trackerDeviceGsmSignal: number;

  @Column({ type: 'smallint', nullable: true, name: 'tracker_device_battery' })
  trackerDeviceBattery: number;

  @Column({
    type: 'real',
    nullable: true,
    name: 'tracker_device_battery_current_amps',
  })
  trackerDeviceBatteryCurrentAmps: number;

  @Column({ type: 'smallint', nullable: true, name: 'tracker_device_status' })
  trackerDeviceStatus: number;

  @Column({
    type: 'smallint',
    nullable: true,
    name: 'tracker_device_data_mode',
  })
  trackerDeviceDataMode: number;

  @Column({
    type: 'smallint',
    nullable: true,
    name: 'tracker_device_network_type',
  })
  trackerDeviceNetworkType: number;

  @Column({
    type: 'integer',
    nullable: true,
    name: 'tracker_device_gsm_area_code',
  })
  trackerDeviceGsmAreaCode: number;

  @Column({
    type: 'bigint',
    nullable: true,
    name: 'tracker_device_active_gsm_operator',
    transformer: bigintTransformer,
  })
  trackerDeviceActiveGsmOperator: number;

  @Column({ type: 'integer', nullable: true, name: 'tracker_device_cell_id' })
  trackerDeviceCellId: number;

  @Column({
    type: 'smallint',
    nullable: true,
    name: 'tracker_device_packet_id',
  })
  trackerDevicePacketId: number;

  @Column({ type: 'smallint', nullable: true, name: 'tracker_device_codec_id' })
  trackerDeviceCodecId: number;

  @Column({ type: 'smallint', nullable: true, name: 'tracker_accuracy' })
  trackerAccuracy: number;

  @Column({
    type: 'smallint',
    nullable: true,
    name: 'tracker_device_gnss_state',
  })
  trackerDeviceGnssState: number;

  @Column({
    type: 'smallint',
    nullable: true,
    name: 'tracker_device_number_of_satellites',
  })
  trackerDeviceNumberOfSatellites: number;

  @Column({ type: 'real', nullable: true, name: 'tracker_device_gnss_pdop' })
  trackerDeviceGnssPdop: number;

  @Column({ type: 'real', nullable: true, name: 'tracker_device_gnss_hdop' })
  trackerDeviceGnssHdop: number;

  @Column({ type: 'text', nullable: true, name: 'tracker_device_geocode' })
  trackerDeviceGeocode: string;

  @Column({
    type: 'uuid',
    nullable: true,
    name: 'tracker_device_id_municipality',
  })
  trackerDeviceIdMunicipality: string;

  @Column({ type: 'uuid', nullable: true, name: 'tracker_plot_uuid' })
  trackerPlotUuid: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'tracker_device_inside_geofence',
  })
  trackerDeviceInsideGeofence: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'tracker_device_inside_quadrant',
  })
  trackerDeviceInsideQuadrant: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'tracker_device_inside_sector',
  })
  trackerDeviceInsideSector: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'tracker_device_inside_any_sector',
  })
  trackerDeviceInsideAnySector: boolean;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'tracker_device_inside_any_sector_name',
  })
  trackerDeviceInsideAnySectorName: string;

  @Column({
    type: 'uuid',
    nullable: true,
    name: 'tracker_device_inside_any_sector_id',
  })
  trackerDeviceInsideAnySectorId: string;

  @Column({ type: 'jsonb', nullable: true, name: 'tracker_device_quadrant' })
  trackerDeviceQuadrant: {
    quadrant_id: string;
    quadrant_name: string;
  };

  @Column({ type: 'integer', nullable: true, name: 'tracker_device_trip_id' })
  trackerDeviceTripId: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'tracker_device_alarm',
  })
  trackerDeviceAlarm: string;

  @Column({
    type: 'real',
    nullable: true,
    name: 'tracker_device_gallons_per_km',
  })
  trackerDeviceGallonsPerKm: number;

  @Column({
    type: 'real',
    nullable: true,
    name: 'tracker_device_fuel_consumed_per_day',
  })
  trackerDeviceFuelConsumedPerDay: number;
}
