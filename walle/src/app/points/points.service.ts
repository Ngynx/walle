import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from './model/point.model';

@Injectable()
export class PointsService {
    constructor(
        @InjectRepository(Point)
        private readonly pointsRepository: Repository<Point>,
    ) { }

    // Aquí puedes agregar métodos para trabajar con los puntos AVL
    // Por ejemplo: crear, buscar, actualizar, etc.
}
