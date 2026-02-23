import {
  Entity,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'points', synchronize: false })
@Index(['trackerDeviceImei', 'timestamp'], { unique: true })
export class Point {
  // ─── Primary Key compuesta (requerida por particionamiento) ──────────────────
  /**
   * PK compuesta obligatoria en tablas particionadas por RANGE.
   * PostgreSQL exige que la partition key (timestamp) sea parte de la PK
   * o que la PK la incluya, para garantizar unicidad entre particiones.
   */
  @PrimaryColumn({
    type: 'uuid',
    name: 'id',
    default: () => 'gen_random_uuid()',
  })
  id: string;

  @PrimaryColumn({ type: 'bigint', name: 'timestamp' })
  timestamp: number;

  // ─── Identificación del dispositivo ──────────────────────────────────────────
  @Column({ type: 'bigint', name: 'tracker_device_imei' })
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

  // ─── Posición geoespacial (PostGIS) ──────────────────────────────────────────
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

  // ─── Temporal ─────────────────────────────────────────────────────────────────
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

  // ─── Movimiento y velocidad ───────────────────────────────────────────────────
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

  // ─── Distancias ───────────────────────────────────────────────────────────────
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

  // ─── Kilómetros por día ───────────────────────────────────────────────────────
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

  // ─── Tiempos conducción / estacionamiento (segundos) ─────────────────────────
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

  // ─── Horas motor ──────────────────────────────────────────────────────────────
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

  // ─── Señal y hardware ─────────────────────────────────────────────────────────
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

  // ─── GNSS ─────────────────────────────────────────────────────────────────────
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

  // ─── Geocodificación y zonas ──────────────────────────────────────────────────
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

  // ─── Geofences y sectores ─────────────────────────────────────────────────────
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

  // ─── Viaje y alarmas ──────────────────────────────────────────────────────────
  @Column({ type: 'integer', nullable: true, name: 'tracker_device_trip_id' })
  trackerDeviceTripId: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'tracker_device_alarm',
  })
  trackerDeviceAlarm: string;

  // ─── Combustible ─────────────────────────────────────────────────────────────
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
