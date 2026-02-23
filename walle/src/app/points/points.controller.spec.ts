import { MethodNotAllowedException } from '@nestjs/common';
import { GetPointsQueryDto } from './dto/get-points-query.dto';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

describe('PointsController', () => {
  const buildController = () => {
    const pointsService = {
      findAll: jest.fn(),
    } as unknown as PointsService;
    const controller = new PointsController(pointsService);
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
