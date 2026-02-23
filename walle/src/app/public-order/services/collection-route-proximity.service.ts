import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as turf from "@turf/helpers";
import pointToLineDistance from "@turf/point-to-line-distance";
import {
	CollectionPoint,
	CollectionPointDocument,
} from "../schemas/collection-point.schema";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";

interface NearbyPointResult {
	point: CollectionPoint;
	distanceMeters: number;
}

@Injectable()
export class CollectionRouteProximityService {
	constructor(
		@InjectModel(CollectionPoint.name, ROBIN_SERVER_DB_NAME)
		private readonly collectionPointModel: Model<CollectionPointDocument>
	) { }

	/**
	 * Encuentra puntos de recojo cuya ruta pasa dentro de su geofence
	 * El radio se toma del geofence_area.radius de cada punto
	 * @param routePath Array de coordenadas de la ruta [{lat, lng}, ...]
	 * @param defaultRadiusMeters Radio por defecto si el punto no tiene geofence (default: 50m)
	 */
	async findNearbyPoints(
		routePath: { lat: number; lng: number }[],
		defaultRadiusMeters: number = 50
	): Promise<NearbyPointResult[]> {
		if (!routePath || routePath.length < 2) {
			return [];
		}

		// 1. Obtener todos los puntos activos
		const allPoints = await this.collectionPointModel
			.find({ is_active: true })
			.populate("container_type_id")
			.exec();

		// 2. Convertir ruta a LineString de GeoJSON [lng, lat] format
		const lineCoords = routePath.map((p) => [p.lng, p.lat]);
		const line = turf.lineString(lineCoords);

		// 3. Filtrar puntos que estén dentro de su radio de geofence
		const nearbyPoints: NearbyPointResult[] = [];

		for (const point of allPoints) {
			const pointGeo = turf.point([
				point.location.longitude,
				point.location.latitude,
			]);

			const distanceMeters = pointToLineDistance(pointGeo, line, {
				units: "meters",
			});

			// Usar el radio del geofence del punto, o el default
			const radius =
				point.geofence_area?.type === "circle" && point.geofence_area?.radius
					? point.geofence_area.radius
					: defaultRadiusMeters;

			if (distanceMeters <= radius) {
				nearbyPoints.push({
					point: point,
					distanceMeters: Math.round(distanceMeters),
				});
			}
		}

		// Ordenar por distancia (más cercanos primero)
		return nearbyPoints.sort((a, b) => a.distanceMeters - b.distanceMeters);
	}

	/**
	 * Encuentra puntos de recojo cercanos y retorna solo los IDs
	 */
	async findNearbyPointIds(
		routePath: { lat: number; lng: number }[],
		defaultRadiusMeters: number = 50
	): Promise<string[]> {
		const nearbyPoints = await this.findNearbyPoints(
			routePath,
			defaultRadiusMeters
		);
		return nearbyPoints.map((np) => (np.point as any)._id.toString());
	}
}
