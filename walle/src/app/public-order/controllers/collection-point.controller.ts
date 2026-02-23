import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CollectionPointService } from "../services/collection-point.service";
import { CreateCollectionPointDto, UpdateCollectionPointDto } from "../dto/collection-point.dto";
import { Auth } from "src/common/decorators";
import Responses from "src/common/interfaces/responses.interface";

@ApiTags("Public Order - Collection Points")
@Controller("public-order/collection-points")
export class CollectionPointController {
	constructor(
		private readonly collectionPointService: CollectionPointService
	) { }

	@Auth()
	@Get("")
	async findAll(@Res() res: Responses): Promise<Responses> {
		try {
			const documents = await this.collectionPointService.findAll();
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
			const document = await this.collectionPointService.findById(id);
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
		@Body() dto: CreateCollectionPointDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const newDocument = await this.collectionPointService.create(dto);
			res.status(200);
			return res.json({
				success: true,
				data: newDocument,
				message: "Collection point created successfully!",
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
		@Body() dto: UpdateCollectionPointDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const updatedDocument = await this.collectionPointService.update(id, dto);
			res.status(200);
			return res.json({
				success: !!updatedDocument,
				data: updatedDocument,
				message: updatedDocument
					? "Collection point updated successfully!"
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
			const deletedDocument = await this.collectionPointService.delete(id);
			res.status(200);
			return res.json({
				success: !!deletedDocument,
				data: deletedDocument,
				message: deletedDocument
					? "Collection point deleted successfully!"
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
}
