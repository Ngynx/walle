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
import { MonthlyPlanService } from "../services/monthly-plan.service";
import {
	CreateMonthlyPlanDto,
	UpdateMonthlyPlanDto,
} from "../dto/monthly-plan.dto";
import Responses from "src/common/interfaces/responses.interface";
import { Auth } from "src/common/decorators";

@ApiTags("Public Order - Monthly Plans")
@Controller("public-order/monthly-plans")
export class MonthlyPlanController {
	constructor(private readonly monthlyPlanService: MonthlyPlanService) { }

	@Auth()
	@Get("")
	async findAll(@Res() res: Responses): Promise<Responses> {
		try {
			const documents = await this.monthlyPlanService.findAll();
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
	@Get(":year/:month")
	async findByYearMonth(
		@Param("year") year: string,
		@Param("month") month: string,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const document = await this.monthlyPlanService.findByYearMonth(
				parseInt(year),
				parseInt(month)
			);
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
	@Get(":id")
	async findById(
		@Param("id") id: string,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const document = await this.monthlyPlanService.findById(id);
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
		@Body() dto: CreateMonthlyPlanDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const newDocument = await this.monthlyPlanService.create(dto);
			res.status(200);
			return res.json({
				success: true,
				data: newDocument,
				message: "Monthly plan created successfully!",
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
		@Body() dto: UpdateMonthlyPlanDto,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const updatedDocument = await this.monthlyPlanService.update(id, dto);
			res.status(200);
			return res.json({
				success: !!updatedDocument,
				data: updatedDocument,
				message: updatedDocument
					? "Monthly plan updated successfully!"
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
			const deletedDocument = await this.monthlyPlanService.delete(id);
			res.status(200);
			return res.json({
				success: !!deletedDocument,
				data: deletedDocument,
				message: deletedDocument
					? "Monthly plan deleted successfully!"
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
