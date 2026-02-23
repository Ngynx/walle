import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

// Schemas
import {
	CollectionPoint,
	CollectionPointSchema,
} from "./schemas/collection-point.schema";
import {
	CollectionRoute,
	CollectionRouteSchema,
} from "./schemas/collection-route.schema";
import {
	MonthlyGarbagePlan,
	MonthlyGarbagePlanSchema,
} from "./schemas/monthly-plan.schema";
import {
	RouteExecutionSummary,
	RouteExecutionSummarySchema,
} from "./schemas/route-execution.schema";
import {
	ContainerType,
	ContainerTypeSchema,
} from "./schemas/container-type.schema";
import {
	LocationPoint,
	LocationPointSchema,
} from "./schemas/location-point.schema";

// Services
import { CollectionPointService } from "./services/collection-point.service";
import { CollectionRouteService } from "./services/collection-route.service";
import { CollectionRouteProximityService } from "./services/collection-route-proximity.service";
import { MonthlyPlanService } from "./services/monthly-plan.service";
import { RouteExecutionService } from "./services/route-execution.service";
import { ContainerTypeService } from "./services/container-type.service";
import { LocationPointService } from "./services/location-point.service";

// Controllers
import { CollectionPointController } from "./controllers/collection-point.controller";
import { CollectionRouteController } from "./controllers/collection-route.controller";
import { MonthlyPlanController } from "./controllers/monthly-plan.controller";
import { RouteExecutionController } from "./controllers/route-execution.controller";
import { ContainerTypeController } from "./controllers/container-type.controller";
import { LocationPointController } from "./controllers/location-point.controller";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: CollectionPoint.name, schema: CollectionPointSchema },
				{ name: CollectionRoute.name, schema: CollectionRouteSchema },
				{ name: MonthlyGarbagePlan.name, schema: MonthlyGarbagePlanSchema },
				{
					name: RouteExecutionSummary.name,
					schema: RouteExecutionSummarySchema,
				},
				{ name: ContainerType.name, schema: ContainerTypeSchema },
				{ name: LocationPoint.name, schema: LocationPointSchema },
			],
			ROBIN_SERVER_DB_NAME
		),
	],
	controllers: [
		CollectionPointController,
		CollectionRouteController,
		MonthlyPlanController,
		RouteExecutionController,
		ContainerTypeController,
		LocationPointController,
	],
	providers: [
		CollectionPointService,
		CollectionRouteService,
		CollectionRouteProximityService,
		MonthlyPlanService,
		RouteExecutionService,
		ContainerTypeService,
		LocationPointService,
	],
	exports: [
		CollectionPointService,
		CollectionRouteService,
		CollectionRouteProximityService,
		MonthlyPlanService,
		RouteExecutionService,
		ContainerTypeService,
		LocationPointService,
	],
})
export class PublicOrderModule { }
