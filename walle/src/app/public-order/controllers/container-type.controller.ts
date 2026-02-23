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
import { ContainerTypeService } from "../services/container-type.service";
import {
	CreateContainerTypeDto,
	UpdateContainerTypeDto,
} from "../dto/container-type.dto";
import { extname } from "path";
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

@ApiTags("Public Order - Container Types")
@Controller("public-order/container-types")
export class ContainerTypeController {
	constructor(private readonly containerTypeService: ContainerTypeService) { }

	@Auth()
	@Get("")
	async findAll(@Res() res: Responses): Promise<Responses> {
		try {
			const documents = await this.containerTypeService.findAll();
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
			const documents = await this.containerTypeService.findActive();
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
			const document = await this.containerTypeService.findById(id);
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
		@Body() dto: CreateContainerTypeDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const newDocument = await this.containerTypeService.create(dto);
			res.status(200);
			return res.json({
				success: true,
				data: newDocument,
				message: "Container type created successfully!",
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
		@Body() dto: UpdateContainerTypeDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const updatedDocument = await this.containerTypeService.update(id, dto);
			res.status(200);
			return res.json({
				success: !!updatedDocument,
				data: updatedDocument,
				message: updatedDocument
					? "Container type updated successfully!"
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
			const deletedDocument = await this.containerTypeService.delete(id);
			res.status(200);
			return res.json({
				success: !!deletedDocument,
				data: deletedDocument,
				message: deletedDocument
					? "Container type deleted successfully!"
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
				destination: "./uploads/container-icons",
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

			const iconUrl = `/uploads/container-icons/${file.filename}`;
			const updatedDocument = await this.containerTypeService.updateIcon(
				id,
				iconUrl
			);

			res.status(200);
			return res.json({
				success: !!updatedDocument,
				data: updatedDocument,
				message: updatedDocument
					? "Icon uploaded successfully!"
					: "Container type not found!",
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
