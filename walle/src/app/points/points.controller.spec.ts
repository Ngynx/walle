import { MethodNotAllowedException } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

describe('PointsController', () => {
  it('rejects manual ingestion through POST /points', () => {
    const pointsService = {
      findAll: jest.fn(),
    } as unknown as PointsService;
    const controller = new PointsController(pointsService);

    expect(() => controller.create()).toThrow(MethodNotAllowedException);
  });
});
