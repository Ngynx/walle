import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
	LocationPoint,
	LocationPointDocument,
	LocationPointType,
} from "../schemas/location-point.schema";
import {
	CreateLocationPointDto,
	UpdateLocationPointDto,
} from "../dto/location-point.dto";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";

@Injectable()
export class LocationPointService {
	constructor(
		@InjectModel(LocationPoint.name, ROBIN_SERVER_DB_NAME)
		private readonly locationPointModel: Model<LocationPointDocument>
	) { }

	async findAll(): Promise<LocationPoint[]> {
		return this.locationPointModel.find().sort({ name: 1 }).exec();
	}

	async findActive(): Promise<LocationPoint[]> {
		return this.locationPointModel
			.find({ is_active: true })
			.sort({ name: 1 })
			.exec();
	}

	async findByType(type: LocationPointType): Promise<LocationPoint[]> {
		return this.locationPointModel
			.find({ type, is_active: true })
			.sort({ name: 1 })
			.exec();
	}

	async findById(id: string): Promise<LocationPoint | null> {
		return this.locationPointModel.findById(id).exec();
	}

	async create(dto: CreateLocationPointDto): Promise<LocationPoint> {
		const newDocument = new this.locationPointModel(dto);
		return newDocument.save();
	}

	async update(
		id: string,
		dto: UpdateLocationPointDto
	): Promise<LocationPoint | null> {
		return this.locationPointModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
	}

	async delete(id: string): Promise<LocationPoint | null> {
		return this.locationPointModel.findByIdAndDelete(id).exec();
	}

	async updateIcon(id: string, iconUrl: string): Promise<LocationPoint | null> {
		return this.locationPointModel
			.findByIdAndUpdate(id, { icon_url: iconUrl }, { new: true })
			.exec();
	}

	async toggleActive(id: string): Promise<LocationPoint | null> {
		const document = await this.locationPointModel.findById(id).exec();
		if (!document) return null;

		return this.locationPointModel
			.findByIdAndUpdate(id, { is_active: !document.is_active }, { new: true })
			.exec();
	}
}
