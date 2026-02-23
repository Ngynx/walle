import { MethodNotAllowedException } from '@nestjs/common';
import { GetPointsQueryDto } from '../points/dto/get-points-query.dto';
import { PointsTimescaleController } from './points-timescale.controller';
import { PointsTimescaleService } from './points-timescale.service';

describe('PointsTimescaleController', () => {
  const buildController = () => {
    const pointsService = {
      findAll: jest.fn(),
    } as unknown as PointsTimescaleService;
    const controller = new PointsTimescaleController(pointsService);
    return { controller, pointsService };
  };

  it('rejects manual ingestion through POST /points', () => {
    const { controller } = buildController();

    expect(() => controller.create()).toThrow(MethodNotAllowedException);
  });

  it('delegates GET /points to service', async () => {
    const { controller, pointsService } = buildController();
    const query: GetPointsQueryDto = { page: 1, limit: 10 };
    const response = { data: [], meta: { page: 1, limit: 10 } } as any;
    (pointsService.findAll as jest.Mock).mockResolvedValue(response);

    await expect(controller.findAll(query)).resolves.toEqual(response);
    expect(pointsService.findAll).toHaveBeenCalledWith(query);
  });
});
