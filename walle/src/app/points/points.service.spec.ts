import { CreatePointDto } from './dto/create-point.dto';
import { GetPointsQueryDto } from './dto/get-points-query.dto';
import { PointsService } from './points.service';

describe('PointsService', () => {
  const basePoint = (timestamp: number): CreatePointDto => ({
    timestamp,
    trackerDeviceImei: 357440806188378,
    trackerDeviceLatitude: -16.42,
    trackerDeviceLongitude: -71.53,
  });

  const buildService = (options?: {
    createPartitionForDateMock?: jest.Mock;
    executeMock?: jest.Mock;
  }) => {
    const execute =
      options?.executeMock ??
      jest.fn().mockResolvedValue({ generatedMaps: [{ id: '1' }] });
    const queryBuilder = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      orIgnore: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      execute,
    };
    const pointsRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      findAndCount: jest.fn(),
    };
    const partitionManagerService = {
      createPartitionForDate:
        options?.createPartitionForDateMock ??
        jest.fn().mockResolvedValue(undefined),
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

    const { service, partitionManagerService } = buildService({
      createPartitionForDateMock: createPartitionForDate,
    });

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

  it('returns null when insert is ignored as duplicate', async () => {
    const execute = jest.fn().mockResolvedValue({ generatedMaps: [] });
    const { service } = buildService({ executeMock: execute });

    await expect(service.create(basePoint(1771614315000))).resolves.toBeNull();
  });

  it('returns paginated list with metadata', async () => {
    const { service, pointsRepository } = buildService();
    const point = { id: '1', timestamp: 1771614315000 } as any;
    pointsRepository.findAndCount.mockResolvedValue([[point], 41]);

    const query: GetPointsQueryDto = { page: 2, limit: 20 };
    const result = await service.findAll(query);

    expect(pointsRepository.findAndCount).toHaveBeenCalledWith({
      order: { timestamp: 'DESC' },
      skip: 20,
      take: 20,
    });
    expect(result).toEqual({
      data: [point],
      meta: {
        page: 2,
        limit: 20,
        total: 41,
        totalPages: 3,
      },
    });
  });
});
