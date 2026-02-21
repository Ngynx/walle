// Extensiones requeridas para hypertable, geodatos y UUID.
export const CREATE_TIMESCALE_EXTENSIONS_SQL = [
  'CREATE EXTENSION IF NOT EXISTS timescaledb;',
  'CREATE EXTENSION IF NOT EXISTS postgis;',
  'CREATE EXTENSION IF NOT EXISTS pgcrypto;',
];

// Esquema equivalente al modulo legacy, pero en tabla dedicada de Timescale.
export const CREATE_POINTS_TIMESCALE_TABLE = `
  CREATE TABLE IF NOT EXISTS points_timescale (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    timestamp BIGINT NOT NULL,

    tracker_device_imei BIGINT NOT NULL,
    tracker_device_license_plate VARCHAR(20),
    tracker_device_alias VARCHAR(100),

    location GEOMETRY(Point, 4326),
    tracker_device_latitude DOUBLE PRECISION NOT NULL,
    tracker_device_longitude DOUBLE PRECISION NOT NULL,
    tracker_device_altitude DOUBLE PRECISION,

    tracker_device_shipping_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    tracker_device_angle SMALLINT,
    tracker_device_speed_ms REAL DEFAULT 0,
    tracker_device_speed_kh REAL DEFAULT 0,
    tracker_device_movement BOOLEAN DEFAULT false,
    tracker_device_ignition BOOLEAN DEFAULT false,

    tracker_device_distance DOUBLE PRECISION DEFAULT 0,
    tracker_device_total_distance DOUBLE PRECISION DEFAULT 0,

    tracker_device_km_day REAL DEFAULT 0,
    tracker_device_jurisdiction_km_day REAL DEFAULT 0,
    tracker_device_no_jurisdiction_km_day REAL DEFAULT 0,

    tracker_device_driving_time_in_jurisdiction INTEGER DEFAULT 0,
    tracker_device_driving_time_out_of_jurisdiction INTEGER DEFAULT 0,
    tracker_device_parking_time_in_jurisdiction INTEGER DEFAULT 0,
    tracker_device_parking_time_out_of_jurisdiction INTEGER DEFAULT 0,
    tracker_device_tactical_parking INTEGER DEFAULT 0,

    tracker_device_engine_hours REAL DEFAULT 0,
    tracker_device_total_engine_hours REAL DEFAULT 0,
    tracker_device_engine_hours_based_on_ignition REAL DEFAULT 0,
    tracker_device_engine_hours_based_on_ignition_and_stopped REAL DEFAULT 0,

    tracker_device_gsm_signal SMALLINT,
    tracker_device_battery SMALLINT,
    tracker_device_battery_current_amps REAL,
    tracker_device_status SMALLINT,
    tracker_device_data_mode SMALLINT,
    tracker_device_network_type SMALLINT,
    tracker_device_gsm_area_code INTEGER,
    tracker_device_active_gsm_operator BIGINT,
    tracker_device_cell_id INTEGER,
    tracker_device_packet_id SMALLINT,
    tracker_device_codec_id SMALLINT,

    tracker_accuracy SMALLINT,
    tracker_device_gnss_state SMALLINT,
    tracker_device_number_of_satellites SMALLINT,
    tracker_device_gnss_pdop REAL,
    tracker_device_gnss_hdop REAL,

    tracker_device_geocode TEXT,
    tracker_device_id_municipality UUID,
    tracker_plot_uuid UUID,

    tracker_device_inside_geofence BOOLEAN DEFAULT false,
    tracker_device_inside_quadrant BOOLEAN DEFAULT false,
    tracker_device_inside_sector BOOLEAN DEFAULT false,
    tracker_device_inside_any_sector BOOLEAN DEFAULT false,
    tracker_device_inside_any_sector_name VARCHAR(100),
    tracker_device_inside_any_sector_id UUID,
    tracker_device_quadrant JSONB,

    tracker_device_trip_id INTEGER,
    tracker_device_alarm VARCHAR(100),

    tracker_device_gallons_per_km REAL,
    tracker_device_fuel_consumed_per_day REAL,

    PRIMARY KEY (id, timestamp)
  );
`;

// Convierte la tabla en hypertable usando timestamp en milisegundos.
export const buildCreatePointsTimescaleHypertableSql = (
  chunkMs: number,
): string => `
  SELECT create_hypertable(
    'points_timescale',
    'timestamp',
    chunk_time_interval => ${chunkMs},
    if_not_exists => TRUE
  );
`;

// Indices funcionales equivalentes a la estrategia legacy.
export const CREATE_POINTS_TIMESCALE_INDEXES_SQL = [
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_points_timescale_imei_ts
    ON points_timescale (tracker_device_imei, timestamp);`,
  `CREATE INDEX IF NOT EXISTS idx_points_timescale_timestamp
    ON points_timescale (timestamp DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_points_timescale_imei_ts_trip
    ON points_timescale (tracker_device_imei, timestamp, tracker_device_trip_id);`,
  `CREATE INDEX IF NOT EXISTS idx_points_timescale_location
    ON points_timescale USING GIST (location);`,
];

// Habilita compresion por segmento IMEI y orden temporal descendente.
export const ENABLE_POINTS_TIMESCALE_COMPRESSION_SQL = `
  ALTER TABLE points_timescale
  SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'tracker_device_imei',
    timescaledb.compress_orderby = 'timestamp DESC'
  );
`;

// Para tiempo entero (BIGINT), Timescale requiere compresion en milisegundos.
export const buildPointsTimescaleCompressionPolicySql = (
  compressionAfterMs: number,
): string => `
  SELECT add_compression_policy(
    'points_timescale',
    compress_after => ${compressionAfterMs},
    if_not_exists => TRUE
  );
`;

export const REMOVE_POINTS_TIMESCALE_COMPRESSION_POLICY_SQL = `
  SELECT remove_compression_policy('points_timescale', if_exists => TRUE);
`;

// Para tiempo entero (BIGINT), la retencion tambien se define en milisegundos.
export const buildPointsTimescaleRetentionPolicySql = (
  retentionMs: number,
): string => `
  SELECT add_retention_policy(
    'points_timescale',
    drop_after => ${retentionMs},
    if_not_exists => TRUE
  );
`;

export const REMOVE_POINTS_TIMESCALE_RETENTION_POLICY_SQL = `
  SELECT remove_retention_policy('points_timescale', if_exists => TRUE);
`;
