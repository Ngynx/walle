import { CreatePointDto } from '../points/dto/create-point.dto';
import { GetPointsQueryDto } from '../points/dto/get-points-query.dto';
import { PointsTimescaleService } from './points-timescale.service';

describe('PointsTimescaleService', () => {
  const basePoint = (timestamp: number): CreatePointDto => ({
    timestamp,
    trackerDeviceImei: 357440806188378,
    trackerDeviceLatitude: -16.42,
    trackerDeviceLongitude: -71.53,
  });

  const buildService = (executeMock?: jest.Mock) => {
    const execute =
      executeMock ??
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

    const service = new PointsTimescaleService(pointsRepository as any);
    return { service, pointsRepository, queryBuilder };
  };

  it('normalizes second-based timestamps to milliseconds before insert', async () => {
    const { service, queryBuilder } = buildService();

    await service.create(basePoint(1771614315));

    expect(queryBuilder.values).toHaveBeenCalledWith(
      expect.objectContaining({ timestamp: 1771614315000 }),
    );
  });

  it('returns null when insert is ignored as duplicate', async () => {
    const execute = jest.fn().mockResolvedValue({ generatedMaps: [] });
    const { service } = buildService(execute);

    await expect(service.create(basePoint(1771614315000))).resolves.toBeNull();
  });

  it('returns null when imei is missing', async () => {
    const { service } = buildService();

    await expect(
      service.create({
        ...basePoint(1771614315000),
        trackerDeviceImei: 0,
      }),
    ).resolves.toBeNull();
  });

  it('throws when insert query fails', async () => {
    const execute = jest.fn().mockRejectedValue(new Error('db failure'));
    const { service } = buildService(execute);

    await expect(service.create(basePoint(1771614315000))).rejects.toThrow(
      'db failure',
    );
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
