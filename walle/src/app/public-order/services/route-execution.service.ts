import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
	RouteExecutionSummary,
	RouteExecutionSummaryDocument,
} from "../schemas/route-execution.schema";
import { CreateRouteExecutionDto } from "../dto/route-execution.dto";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";
import * as ExcelJS from "exceljs";

@Injectable()
export class RouteExecutionService {
	constructor(
		@InjectModel(RouteExecutionSummary.name, ROBIN_SERVER_DB_NAME)
		private readonly routeExecutionModel: Model<RouteExecutionSummaryDocument>
	) { }

	async findAll(
		page: number = 1,
		limit: number = 10
	): Promise<{ data: RouteExecutionSummary[]; count: number }> {
		const skip = (page - 1) * limit;
		const [data, count] = await Promise.all([
			this.routeExecutionModel
				.find()
				.sort({ start_time: -1 })
				.skip(skip)
				.limit(limit)
				.exec(),
			this.routeExecutionModel.countDocuments().exec(),
		]);
		return { data, count };
	}

	async findById(id: string): Promise<RouteExecutionSummary | null> {
		return this.routeExecutionModel.findById(id).exec();
	}

	async findByDateRange(
		startDate: string,
		endDate: string
	): Promise<RouteExecutionSummary[]> {
		const start = new Date(startDate);
		const end = new Date(endDate);
		end.setHours(23, 59, 59, 999);

		return this.routeExecutionModel
			.find({
				start_time: { $gte: start, $lte: end },
			})
			.sort({ start_time: -1 })
			.exec();
	}

	async create(dto: CreateRouteExecutionDto): Promise<RouteExecutionSummary> {
		const newDocument = new this.routeExecutionModel(dto);
		return newDocument.save();
	}

	async exportToExcel(id: string): Promise<Buffer> {
		const execution = await this.findById(id);
		if (!execution) {
			throw new Error("Route execution not found");
		}

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Resumen de Recorrido");

		// Header info
		worksheet.addRow(["Resumen de Recorrido"]);
		worksheet.addRow([]);
		worksheet.addRow(["Ruta:", execution.route_name]);
		worksheet.addRow(["Vehículo:", execution.vehicle_plate]);
		worksheet.addRow(["Inicio:", execution.start_time.toLocaleString()]);
		worksheet.addRow(["Fin:", execution.end_time.toLocaleString()]);
		worksheet.addRow([
			"Duración Total:",
			`${Math.round(execution.total_duration / 60)} minutos`,
		]);
		worksheet.addRow(["Cumplimiento:", execution.overall_compliance]);
		worksheet.addRow([]);

		// Point summaries table
		worksheet.addRow([
			"Punto",
			"Llegada",
			"Salida",
			"Tiempo Parada (min)",
			"Cumplimiento",
		]);

		execution.point_summaries.forEach((point) => {
			worksheet.addRow([
				point.collection_point_name,
				point.arrival_time.toLocaleString(),
				point.departure_time.toLocaleString(),
				Math.round(point.stop_duration / 60),
				point.compliance_status,
			]);
		});

		// Style the header
		worksheet.getCell("A1").font = { bold: true, size: 16 };
		worksheet.getRow(10).font = { bold: true };

		const buffer = await workbook.xlsx.writeBuffer();
		return Buffer.from(buffer);
	}

	async exportDateRangeToExcel(
		startDate: string,
		endDate: string
	): Promise<Buffer> {
		const executions = await this.findByDateRange(startDate, endDate);

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Resumen de Recorridos");

		// Header
		worksheet.addRow(["Resumen de Recorridos"]);
		worksheet.addRow(["Período:", `${startDate} - ${endDate}`]);
		worksheet.addRow([]);
		worksheet.addRow([
			"Fecha",
			"Ruta",
			"Vehículo",
			"Inicio",
			"Fin",
			"Duración (min)",
			"Cumplimiento",
		]);

		executions.forEach((execution) => {
			worksheet.addRow([
				execution.start_time.toLocaleDateString(),
				execution.route_name,
				execution.vehicle_plate,
				execution.start_time.toLocaleTimeString(),
				execution.end_time.toLocaleTimeString(),
				Math.round(execution.total_duration / 60),
				execution.overall_compliance,
			]);
		});

		worksheet.getCell("A1").font = { bold: true, size: 16 };
		worksheet.getRow(4).font = { bold: true };

		const buffer = await workbook.xlsx.writeBuffer();
		return Buffer.from(buffer);
	}

	// Note: PDF export would require pdfkit or similar library
	// For now, we'll create a simple text-based PDF structure
	async exportToPdf(id: string): Promise<Buffer> {
		const execution = await this.findById(id);
		if (!execution) {
			throw new Error("Route execution not found");
		}

		// Simple text representation for PDF
		// In production, use pdfkit or puppeteer for proper PDF generation
		const content = `
RESUMEN DE RECORRIDO
====================

Ruta: ${execution.route_name}
Vehículo: ${execution.vehicle_plate}
Inicio: ${execution.start_time.toLocaleString()}
Fin: ${execution.end_time.toLocaleString()}
Duración Total: ${Math.round(execution.total_duration / 60)} minutos
Cumplimiento General: ${execution.overall_compliance}

DETALLE POR PUNTO
-----------------
${execution.point_summaries
				.map(
					(p) =>
						`- ${p.collection_point_name}: ${Math.round(p.stop_duration / 60)} min (${p.compliance_status
						})`
				)
				.join("\n")}
        `;

		return Buffer.from(content, "utf-8");
	}

	async exportDateRangeToPdf(
		startDate: string,
		endDate: string
	): Promise<Buffer> {
		const executions = await this.findByDateRange(startDate, endDate);

		const content = `
RESUMEN DE RECORRIDOS
=====================
Período: ${startDate} - ${endDate}

${executions
				.map(
					(e) =>
						`${e.start_time.toLocaleDateString()} | ${e.route_name} | ${e.vehicle_plate
						} | ${e.overall_compliance}`
				)
				.join("\n")}

Total de recorridos: ${executions.length}
        `;

		return Buffer.from(content, "utf-8");
	}
}
