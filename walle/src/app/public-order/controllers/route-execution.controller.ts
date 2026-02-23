import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { RouteExecutionService } from "../services/route-execution.service";
import { Response } from "express";
import { Auth } from "src/common/decorators";
import Responses from "src/common/interfaces/responses.interface";

@ApiTags("Public Order - Route Executions")
@Controller("public-order/route-executions")
export class RouteExecutionController {
	constructor(private readonly routeExecutionService: RouteExecutionService) { }

	@Auth()
	@Get("")
	@ApiQuery({ name: "page", required: false })
	@ApiQuery({ name: "limit", required: false })
	async findAll(
		@Res() res: Responses,
		@Query("page") page?: string,
		@Query("limit") limit?: string,
	): Promise<Responses> {
		try {
			const pageNum = page ? parseInt(page) : 1;
			const limitNum = limit ? parseInt(limit) : 10;
			const result = await this.routeExecutionService.findAll(
				pageNum,
				limitNum
			);
			res.status(200);
			return res.json({
				success: result.data.length > 0,
				data: result.data,
				count: result.count,
				message: result.data.length > 0 ? "Data received" : "Data empty",
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
	@Get("by-date")
	@ApiQuery({ name: "start", required: true })
	@ApiQuery({ name: "end", required: true })
	async findByDateRange(
		@Query("start") start: string,
		@Query("end") end: string,
		@Res() res: Responses
	): Promise<Responses> {
		try {
			const documents = await this.routeExecutionService.findByDateRange(
				start,
				end
			);
			res.status(200);
			return res.json({
				success: documents.length > 0,
				data: documents,
				count: documents.length,
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
	@Get("export/pdf")
	@ApiQuery({ name: "start", required: true })
	@ApiQuery({ name: "end", required: true })
	async exportRangePdf(
		@Query("start") start: string,
		@Query("end") end: string,
		@Res() res: Response
	): Promise<void> {
		try {
			const buffer = await this.routeExecutionService.exportDateRangeToPdf(
				start,
				end
			);
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				`attachment; filename=route-executions-${start}-${end}.pdf`
			);
			res.send(buffer);
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error!",
			});
		}
	}

	@Auth()
	@Get("export/excel")
	@ApiQuery({ name: "start", required: true })
	@ApiQuery({ name: "end", required: true })
	async exportRangeExcel(
		@Query("start") start: string,
		@Query("end") end: string,
		@Res() res: Response
	): Promise<void> {
		try {
			const buffer = await this.routeExecutionService.exportDateRangeToExcel(
				start,
				end
			);
			res.setHeader(
				"Content-Type",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			);
			res.setHeader(
				"Content-Disposition",
				`attachment; filename=route-executions-${start}-${end}.xlsx`
			);
			res.send(buffer);
		} catch (error) {
			console.log(error);
			res.status(400).json({
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
			const document = await this.routeExecutionService.findById(id);
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
	@Get(":id/export/pdf")
	async exportPdf(
		@Param("id") id: string,
		@Res() res: Response
	): Promise<void> {
		try {
			const buffer = await this.routeExecutionService.exportToPdf(id);
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				`attachment; filename=route-execution-${id}.pdf`
			);
			res.send(buffer);
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error!",
			});
		}
	}

	@Auth()
	@Get(":id/export/excel")
	async exportExcel(
		@Param("id") id: string,
		@Res() res: Response
	): Promise<void> {
		try {
			const buffer = await this.routeExecutionService.exportToExcel(id);
			res.setHeader(
				"Content-Type",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			);
			res.setHeader(
				"Content-Disposition",
				`attachment; filename=route-execution-${id}.xlsx`
			);
			res.send(buffer);
		} catch (error) {
			console.log(error);
			res.status(400).json({
				success: false,
				data: null,
				message: "Oops! Ocurred an error!",
			});
		}
	}
}
