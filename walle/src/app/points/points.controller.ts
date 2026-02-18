import { Controller } from '@nestjs/common';
import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
    constructor(private readonly pointsService: PointsService) { }

    // Aquí puedes agregar endpoints REST para trabajar con los puntos AVL
    // Por ejemplo: GET, POST, PUT, DELETE
}
