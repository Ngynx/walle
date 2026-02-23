import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
	MonthlyGarbagePlan,
	MonthlyGarbagePlanDocument,
} from "../schemas/monthly-plan.schema";
import {
	CreateMonthlyPlanDto,
	UpdateMonthlyPlanDto,
} from "../dto/monthly-plan.dto";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";

@Injectable()
export class MonthlyPlanService {
	constructor(
		@InjectModel(MonthlyGarbagePlan.name, ROBIN_SERVER_DB_NAME)
		private readonly monthlyPlanModel: Model<MonthlyGarbagePlanDocument>
	) { }

	async findAll(): Promise<MonthlyGarbagePlan[]> {
		return this.monthlyPlanModel.find().sort({ year: -1, month: -1 }).exec();
	}

	async findById(id: string): Promise<MonthlyGarbagePlan | null> {
		return this.monthlyPlanModel.findById(id).exec();
	}

	async findByYearMonth(
		year: number,
		month: number
	): Promise<MonthlyGarbagePlan | null> {
		return this.monthlyPlanModel.findOne({ year, month }).exec();
	}

	async create(dto: CreateMonthlyPlanDto): Promise<MonthlyGarbagePlan> {
		const newDocument = new this.monthlyPlanModel(dto);
		return newDocument.save();
	}

	async update(
		id: string,
		dto: UpdateMonthlyPlanDto
	): Promise<MonthlyGarbagePlan | null> {
		return this.monthlyPlanModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
	}

	async delete(id: string): Promise<MonthlyGarbagePlan | null> {
		return this.monthlyPlanModel.findByIdAndDelete(id).exec();
	}

	async findActive(): Promise<MonthlyGarbagePlan[]> {
		return this.monthlyPlanModel
			.find({ is_active: true })
			.sort({ year: -1, month: -1 })
			.exec();
	}
}
