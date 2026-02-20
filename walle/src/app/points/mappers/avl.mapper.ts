import { AVLD } from '../dto/avl-output.dto';
import { AVLInputD } from '../dto/avl-input.dto';
import { GenericMapper } from '../interfaces/mapper.interface';

/**
 * Traduce el payload crudo de Kafka al contrato interno AVLD.
 */
export const AVLInputToAVLOutputMapper = new GenericMapper<AVLInputD, AVLD>(
  (avl) => {
    // Cast safe para acceso dinámico case-insensitive sin disparar lint de 'any'.
    const raw = avl as unknown as Record<string, unknown>;

    const getNum = (key1: string, key2?: string): number => {
      const val = raw[key1] ?? (key2 ? raw[key2] : undefined);
      return typeof val === 'number' ? val : Number(val ?? 0);
    };

    const getStr = (key1: string, key2?: string): string | undefined => {
      const val = raw[key1] ?? (key2 ? raw[key2] : undefined);
      return typeof val === 'string' ? val : undefined;
    };

    const getBool = (key1: string, key2?: string): boolean => {
      const val = raw[key1] ?? (key2 ? raw[key2] : undefined);
      return !!val;
    };

    const lat = getNum('Lat', 'lat');
    const lng = getNum('Lng', 'lng');
    const imei = getNum('Imei', 'imei');
    const timestamp = getNum('Timestamp', 'timestamp');

    // Solo se crea geometria cuando ambas coordenadas son validas.
    const location =
      Number.isFinite(lat) && Number.isFinite(lng)
        ? `POINT(${lng} ${lat})`
        : undefined;

    return {
      trackerDeviceImei: imei,
      timestamp,

      trackerDeviceAltitude: getNum('Altitud', 'Alt'),
      trackerDeviceBattery: getNum('BatteryLevel', 'Battery'),
      trackerAccuracy: getNum('Accuracy', 'accuracy'),

      trackerDeviceLatitude: lat,
      trackerDeviceLongitude: lng,
      location,

      // Horas de motor: mantenemos en MINUTOS. Aseguramos que el 'Total' sea siempre el valor mayor.
      trackerDeviceEngineHours: Math.min(
        getNum('EngineHours', 'engineHours'),
        getNum('EngineTotalHours', 'engineTotalHours'),
      ),
      trackerDeviceTotalEngineHours: Math.max(
        getNum('EngineHours', 'engineHours'),
        getNum('EngineTotalHours', 'engineTotalHours'),
      ),

      trackerDeviceShippingDate: getStr('ShippingDate', 'shippingDate'),
      trackerDeviceStatus: getNum('Status', 'status'),
      trackerDeviceSpeedMs: getNum('SpeedMs', 'speedMs'),
      trackerDeviceSpeedKh: getNum('Speed', 'speed'),
      trackerDeviceAngle: getNum('Angle', 'angle'),
      trackerDeviceIgnition: getBool('Ignition', 'ignition'),
      trackerDeviceGsmSignal: getNum('GsmSignal', 'gsmSignal'),

      // Distancias: mantenemos en METROS. El valor mayor va a 'TotalDistance' (odómetro).
      trackerDeviceDistance: Math.min(
        getNum('Distance', 'distance'),
        getNum('TotalDistance', 'totalDistance'),
      ),
      trackerDeviceTotalDistance: Math.max(
        getNum('Distance', 'distance'),
        getNum('TotalDistance', 'totalDistance'),
      ),
      trackerDeviceAlarm: getStr('Alarm', 'alarm'),
      trackerDeviceMovement: getBool('Movement', 'movement'),
      trackerDeviceGnssState: getNum('GnssState', 'gnssState'),
      trackerDeviceNumberOfSatellites: getNum(
        'NumberOfSatellites',
        'numberOfSatellites',
      ),

      // GNSS Accuracy
      trackerDeviceGnssPdop:
        getNum('AccuracyGnssPdop', 'accuracyGnssPdop') || getNum('Pdop'),
      trackerDeviceGnssHdop:
        getNum('AccuracyGnssHdop', 'accuracyGnssHdop') || getNum('Hdop'),

      trackerDeviceDataMode: getNum('DataMode', 'dataMode'),
      trackerDeviceNetworkType: getNum('NetworkType', 'networkType'),
      trackerDeviceGsmAreaCode: getNum('GsmAreaCode', 'gsmAreaCode'),
      trackerDeviceBatteryCurrentAmps: getNum(
        'BatteryCurrentAmps',
        'batteryCurrentAmps',
      ),
      trackerDeviceActiveGsmOperator: getNum(
        'ActiveGsmOperator',
        'activeGsmOperator',
      ),
      trackerDeviceCellId: getNum('CellId', 'cellId'),

      trackerDevicePacketId:
        getNum('PacketId', 'packetId') || getNum('packet_id'),
      trackerDeviceCodecId: getNum('CodecId', 'codecId'),

      // Valores por defecto para campos de enriquecimiento aguas arriba.
      trackerDeviceInsideGeofence: false,
      trackerDeviceInsideQuadrant: false,
      trackerDeviceGeocode: undefined,
      trackerDeviceIdMunicipality: undefined,
      trackerDeviceLicensePlate: undefined,
      trackerPlotUuid: undefined,
      trackerDeviceQuadrant: undefined,
    };
  },
);
