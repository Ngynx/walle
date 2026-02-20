import { KafkaPointsController } from './kafka-points.controller';
import { PointsService } from './points.service';

describe('KafkaPointsController', () => {
  let controller: KafkaPointsController;
  let pointsService: { create: jest.Mock };

  const validPayload = {
    Imei: 357440806188378,
    PacketId: 70,
    CodecId: 142,
    Lat: -16.42429222222222,
    Lng: -71.53825833333333,
    Timestamp: 1771614315000,
    SpeedMs: 5.5,
  };

  beforeEach(() => {
    pointsService = {
      create: jest.fn().mockResolvedValue({}),
    };
    controller = new KafkaPointsController(
      pointsService as unknown as PointsService,
    );
  });

  it('persists valid object payloads', async () => {
    await controller.handleGpsData(validPayload as any);

    expect(pointsService.create).toHaveBeenCalledTimes(1);
    expect(pointsService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        trackerDeviceImei: validPayload.Imei,
        timestamp: validPayload.Timestamp,
        trackerDeviceLatitude: validPayload.Lat,
        trackerDeviceLongitude: validPayload.Lng,
      }),
    );
  });

  it('persists valid buffer payloads wrapped in value', async () => {
    const wrappedPayload = {
      value: Buffer.from(JSON.stringify(validPayload)),
    };

    await controller.handleGpsData(wrappedPayload as any);

    expect(pointsService.create).toHaveBeenCalledTimes(1);
  });

  it('drops messages with invalid imei', async () => {
    const loggerSpy = jest
      .spyOn((controller as any).logger, 'error')
      .mockImplementation();
    await controller.handleGpsData({ ...validPayload, Imei: 0 } as any);

    expect(pointsService.create).not.toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalled();
  });

  it('drops messages with invalid timestamp', async () => {
    const loggerSpy = jest
      .spyOn((controller as any).logger, 'error')
      .mockImplementation();
    await controller.handleGpsData({
      ...validPayload,
      Timestamp: undefined,
    } as any);

    expect(pointsService.create).not.toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalled();
  });

  it('drops messages with missing coordinates', async () => {
    const loggerSpy = jest
      .spyOn((controller as any).logger, 'error')
      .mockImplementation();
    await controller.handleGpsData({ ...validPayload, Lat: undefined } as any);

    expect(pointsService.create).not.toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalled();
  });

  it('drops messages with out-of-range coordinates', async () => {
    const loggerSpy = jest
      .spyOn((controller as any).logger, 'error')
      .mockImplementation();
    await controller.handleGpsData({ ...validPayload, Lat: -120 } as any);

    expect(pointsService.create).not.toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalled();
  });

  it('drops malformed JSON string payloads', async () => {
    const loggerSpy = jest
      .spyOn((controller as any).logger, 'error')
      .mockImplementation();
    await controller.handleGpsData('{invalid json' as any);

    expect(pointsService.create).not.toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalled();
  });
});
