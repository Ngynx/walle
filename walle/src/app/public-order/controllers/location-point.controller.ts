import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { LocationPointService } from "../services/location-point.service";
import {
	CreateLocationPointDto,
	UpdateLocationPointDto,
} from "../dto/location-point.dto";
import { LocationPointType } from "../schemas/location-point.schema";
import { Auth } from "src/common/decorators";
import Responses from "src/common/interfaces/responses.interface";

const imageFileFilter = (req, file, callback) => {
	if (
		!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|svg)$/)
	) {
		return callback(new Error("Only image files are allowed!"), false);
	}
	callback(null, true);
};

@ApiTags("Public Order - Location Points")
@Controller("public-order/location-points")
export class LocationPointController {
	constructor(private readonly locationPointService: LocationPointService) { }

	@Auth()
	@Get("")
	async findAll(@Res() res: Responses): Promise<Responses> {
		try {
			const documents = await this.locationPointService.findAll();
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
	@Get("active")
	async findActive(@Res() res: Responses): Promise<Responses> {
		try {
			const documents = await this.locationPointService.findActive();
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
	@Get("type/:type")
	async findByType(
		@Param("type") type: LocationPointType,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			if (!Object.values(LocationPointType).includes(type)) {
				res.status(400);
				return res.json({
					success: false,
					data: null,
					message: `Invalid type. Must be one of: ${Object.values(
						LocationPointType
					).join(", ")}`,
				});
			}

			const documents = await this.locationPointService.findByType(type);
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
			const document = await this.locationPointService.findById(id);
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
		@Body() dto: CreateLocationPointDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const newDocument = await this.locationPointService.create(dto);
			res.status(200);
			return res.json({
				success: true,
				data: newDocument,
				message: "Location point created successfully!",
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
		@Body() dto: UpdateLocationPointDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const updatedDocument = await this.locationPointService.update(id, dto);
			res.status(200);
			return res.json({
				success: !!updatedDocument,
				data: updatedDocument,
				message: updatedDocument
					? "Location point updated successfully!"
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
			const deletedDocument = await this.locationPointService.delete(id);
			res.status(200);
			return res.json({
				success: !!deletedDocument,
				data: deletedDocument,
				message: deletedDocument
					? "Location point deleted successfully!"
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
	@Patch(":id/toggle-active")
	async toggleActive(
		@Param("id") id: string,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const updatedDocument = await this.locationPointService.toggleActive(id);
			res.status(200);
			return res.json({
				success: !!updatedDocument,
				data: updatedDocument,
				message: updatedDocument
					? `Location point ${updatedDocument.is_active ? "activated" : "deactivated"
					} successfully!`
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
	@Post(":id/upload-icon")
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./uploads/location-point-icons",
				filename: (req, file, cb) => {
					const name = file.originalname.split(".")[0];
					const fileExtName = extname(file.originalname);
					const randomName = Array(8)
						.fill(null)
						.map(() => Math.round(Math.random() * 16).toString(16))
						.join("");
					cb(null, `${name}-${randomName}${fileExtName}`);
				},
			}),
			fileFilter: imageFileFilter,
		})
	)
	async uploadIcon(
		@Param("id") id: string,
		@UploadedFile() file: Express.Multer.File,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			if (!file) {
				res.status(400);
				return res.json({
					success: false,
					data: null,
					message: "No file uploaded!",
				});
			}

			const iconUrl = `/uploads/location-point-icons/${file.filename}`;
			const updatedDocument = await this.locationPointService.updateIcon(
				id,
				iconUrl
			);

			res.status(200);
			return res.json({
				success: !!updatedDocument,
				data: updatedDocument,
				message: updatedDocument
					? "Icon uploaded successfully!"
					: "Location point not found!",
			});
		} catch (error) {
			console.log(error);
			res.status(400);
			return res.json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error uploading the icon!",
			});
		}
	}
}
