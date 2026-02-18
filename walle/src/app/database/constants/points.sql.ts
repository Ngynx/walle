export const CREATE_POINTS_PARENT_TABLE = `
    CREATE TABLE points (
      id UUID NOT NULL DEFAULT gen_random_uuid(),
      timestamp BIGINT NOT NULL,
      
      -- Identificación del dispositivo
      tracker_device_imei BIGINT NOT NULL,
      tracker_device_license_plate VARCHAR(20),
      tracker_device_alias VARCHAR(100),
      
      -- Posición geoespacial (PostGIS)
      location GEOMETRY(Point, 4326),
      tracker_device_latitude DOUBLE PRECISION NOT NULL,
      tracker_device_longitude DOUBLE PRECISION NOT NULL,
      tracker_device_altitude DOUBLE PRECISION,
      
      -- Temporal
      tracker_device_shipping_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      
      -- Movimiento y velocidad
      tracker_device_angle SMALLINT,
      tracker_device_speed_ms REAL DEFAULT 0,
      tracker_device_speed_kh REAL DEFAULT 0,
      tracker_device_movement BOOLEAN DEFAULT false,
      tracker_device_ignition BOOLEAN DEFAULT false,
      
      -- Distancias
      tracker_device_distance DOUBLE PRECISION DEFAULT 0,
      tracker_device_total_distance DOUBLE PRECISION DEFAULT 0,
      
      -- Kilómetros por día
      tracker_device_km_day REAL DEFAULT 0,
      tracker_device_jurisdiction_km_day REAL DEFAULT 0,
      tracker_device_no_jurisdiction_km_day REAL DEFAULT 0,
      
      -- Tiempos conducción / estacionamiento
      tracker_device_driving_time_in_jurisdiction INTEGER DEFAULT 0,
      tracker_device_driving_time_out_of_jurisdiction INTEGER DEFAULT 0,
      tracker_device_parking_time_in_jurisdiction INTEGER DEFAULT 0,
      tracker_device_parking_time_out_of_jurisdiction INTEGER DEFAULT 0,
      tracker_device_tactical_parking INTEGER DEFAULT 0,
      
      -- Horas motor
      tracker_device_engine_hours REAL DEFAULT 0,
      tracker_device_total_engine_hours REAL DEFAULT 0,
      tracker_device_engine_hours_based_on_ignition REAL DEFAULT 0,
      tracker_device_engine_hours_based_on_ignition_and_stopped REAL DEFAULT 0,
      
      -- Señal y hardware
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
      
      -- GNSS
      tracker_accuracy SMALLINT,
      tracker_device_gnss_state SMALLINT,
      tracker_device_number_of_satellites SMALLINT,
      tracker_device_gnss_pdop REAL,
      tracker_device_gnss_hdop REAL,
      
      -- Geocodificación y zonas
      tracker_device_geocode TEXT,
      tracker_device_id_municipality UUID,
      tracker_plot_uuid UUID,
      
      -- Geofences y sectores
      tracker_device_inside_geofence BOOLEAN DEFAULT false,
      tracker_device_inside_quadrant BOOLEAN DEFAULT false,
      tracker_device_inside_sector BOOLEAN DEFAULT false,
      tracker_device_inside_any_sector BOOLEAN DEFAULT false,
      tracker_device_inside_any_sector_name VARCHAR(100),
      tracker_device_inside_any_sector_id UUID,
      tracker_device_quadrant JSONB,
      
      -- Viaje y alarmas
      tracker_device_trip_id INTEGER,
      tracker_device_alarm VARCHAR(100),
      
      -- Combustible
      tracker_device_gallons_per_km REAL,
      tracker_device_fuel_consumed_per_day REAL,
      
      -- Primary Key compuesta (requerida por particionamiento)
      PRIMARY KEY (id, timestamp)
    ) PARTITION BY RANGE (timestamp);
`;
