import { AVLInputToAVLOutputMapper } from './avl.mapper';

describe('AVLInputToAVLOutputMapper', () => {
  it('maps engine hour fields without converting units', () => {
    const mapped = AVLInputToAVLOutputMapper.map({
      Imei: 357440806188378,
      Timestamp: 1771614315000,
      Lat: -16.42429222222222,
      Lng: -71.53825833333333,
      EngineHours: 140,
      EngineTotalHours: 140,
    } as any);

    expect(mapped.trackerDeviceEngineHours).toBe(140);
    expect(mapped.trackerDeviceTotalEngineHours).toBe(140);
  });

  it('defaults engine hour fields to zero when not provided', () => {
    const mapped = AVLInputToAVLOutputMapper.map({
      Imei: 357440806188378,
      Timestamp: 1771614315000,
      Lat: -16.42429222222222,
      Lng: -71.53825833333333,
    } as any);

    expect(mapped.trackerDeviceEngineHours).toBe(0);
    expect(mapped.trackerDeviceTotalEngineHours).toBe(0);
  });

  it('does not generate location when coordinates are missing', () => {
    const mapped = AVLInputToAVLOutputMapper.map({
      Imei: 357440806188378,
      Timestamp: 1771614315000,
    } as any);

    expect(mapped.location).toBeUndefined();
    expect(Number.isNaN(mapped.trackerDeviceLatitude)).toBe(true);
    expect(Number.isNaN(mapped.trackerDeviceLongitude)).toBe(true);
  });
});
