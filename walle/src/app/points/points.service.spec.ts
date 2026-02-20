import { CreatePointDto } from './dto/create-point.dto';
import { PointsService } from './points.service';

describe('PointsService', () => {
  const basePoint = (timestamp: number): CreatePointDto => ({
    timestamp,
    trackerDeviceImei: 357440806188378,
    trackerDeviceLatitude: -16.42,
    trackerDeviceLongitude: -71.53,
  });

  const buildService = (createPartitionForDateMock?: jest.Mock) => {
    const execute = jest
      .fn()
      .mockResolvedValue({ generatedMaps: [{ id: '1' }] });
    const queryBuilder = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      execute,
    };
    const pointsRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      findAndCount: jest.fn(),
    };
    const partitionManagerService = {
      createPartitionForDate:
        createPartitionForDateMock ?? jest.fn().mockResolvedValue(undefined),
    };

    const service = new PointsService(
      pointsRepository as any,
      partitionManagerService as any,
    );
    return { service, pointsRepository, partitionManagerService, queryBuilder };
  };

  it('creates partition only once for points on the same UTC day', async () => {
    const { service, partitionManagerService } = buildService();

    await service.create(basePoint(1771614315000));
    await service.create(basePoint(1771614315999));

    expect(
      partitionManagerService.createPartitionForDate,
    ).toHaveBeenCalledTimes(1);
  });

  it('creates partition again for points on different UTC days', async () => {
    const { service, partitionManagerService } = buildService();

    await service.create(basePoint(1771614315000));
    await service.create(basePoint(1771700715000));

    expect(
      partitionManagerService.createPartitionForDate,
    ).toHaveBeenCalledTimes(2);
  });

  it('retries partition creation after a failed attempt', async () => {
    const createPartitionForDate = jest
      .fn()
      .mockRejectedValueOnce(new Error('partition failure'))
      .mockResolvedValueOnce(undefined);

    const { service, partitionManagerService } = buildService(
      createPartitionForDate,
    );

    await expect(service.create(basePoint(1771614315000))).rejects.toThrow(
      'partition failure',
    );
    await expect(
      service.create(basePoint(1771614315000)),
    ).resolves.toBeDefined();
    expect(
      partitionManagerService.createPartitionForDate,
    ).toHaveBeenCalledTimes(2);
  });

  it('normalizes second-based timestamps to milliseconds before insert', async () => {
    const { service, queryBuilder } = buildService();

    await service.create(basePoint(1771614315));

    expect(queryBuilder.values).toHaveBeenCalledWith(
      expect.objectContaining({ timestamp: 1771614315000 }),
    );
  });
});
