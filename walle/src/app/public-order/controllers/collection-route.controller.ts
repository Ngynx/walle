import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Res,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CollectionRouteService } from "../services/collection-route.service";
import { CollectionRouteProximityService } from "../services/collection-route-proximity.service";
import {
	CreateCollectionRouteDto,
	UpdateCollectionRouteDto,
} from "../dto/collection-route.dto";
import { Auth } from "src/common/decorators";
import Responses from "src/common/interfaces/responses.interface";

@ApiTags("Public Order - Collection Routes")
@Controller("public-order/collection-routes")
export class CollectionRouteController {
	constructor(
		private readonly collectionRouteService: CollectionRouteService,
		private readonly proximityService: CollectionRouteProximityService
	) { }

	@Auth()
	@Get("")
	async findAll(@Res() res: Responses): Promise<Responses> {
		try {
			const documents = await this.collectionRouteService.findAll();
			res.status(200);
			return res.json({
				success: documents.length > 0,
				data: documents,
				message: documents.length > 0 ? "Data received" : "Data empty",
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error!",
			});
		}
	}

	@Auth()
	@Get(":id")
	async findById(
		@Param("id") id: string,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const document = await this.collectionRouteService.findById(id);
			res.status(200);
			return res.json({
				success: !!document,
				data: document,
				message: document ? "Data received!" : "Data empty",
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error!",
			});
		}
	}

	@Auth()
	@Post("")
	async create(
		@Body() dto: CreateCollectionRouteDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const newDocument = await this.collectionRouteService.create(dto);
			res.status(200);
			return res.json({
				success: true,
				data: newDocument,
				message: "Collection route created successfully!",
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error!",
			});
		}
	}

	@Auth()
	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateCollectionRouteDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const updatedDocument = await this.collectionRouteService.update(id, dto);
			res.status(200);
			return res.json({
				success: !!updatedDocument,
				data: updatedDocument,
				message: updatedDocument
					? "Collection route updated successfully!"
					: "Document not found!",
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error!",
			});
		}
	}

	@Auth()
	@Delete(":id")
	async delete(
		@Param("id") id: string,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const deletedDocument = await this.collectionRouteService.delete(id);
			res.status(200);
			return res.json({
				success: !!deletedDocument,
				data: deletedDocument,
				message: deletedDocument
					? "Collection route deleted successfully!"
					: "Document not found!",
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error!",
			});
		}
	}

	@Auth()
	@Post("detect-nearby-points")
	async detectNearbyPoints(
		@Body()
		dto: {
			route_path: { lat: number; lng: number }[];
			default_radius_meters?: number;
		},
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const nearbyPoints = await this.proximityService.findNearbyPoints(
				dto.route_path,
				dto.default_radius_meters || 50
			);
			res.status(200);
			return res.json({
				success: true,
				data: nearbyPoints,
				message: `Found ${nearbyPoints.length} nearby collection points`,
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error!",
			});
		}
	}
}
