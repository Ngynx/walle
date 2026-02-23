import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
	CollectionPoint,
	CollectionPointDocument,
} from "../schemas/collection-point.schema";
import {
	CreateCollectionPointDto,
	UpdateCollectionPointDto,
} from "../dto/collection-point.dto";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";

@Injectable()
export class CollectionPointService {
	constructor(
		@InjectModel(CollectionPoint.name, ROBIN_SERVER_DB_NAME)
		private readonly collectionPointModel: Model<CollectionPointDocument>
	) { }

	async findAll(): Promise<CollectionPoint[]> {
		return this.collectionPointModel
			.find()
			.populate("container_type_id")
			.sort({ order: 1 })
			.exec();
	}

	async findById(id: string): Promise<CollectionPoint | null> {
		return this.collectionPointModel
			.findById(id)
			.populate("container_type_id")
			.exec();
	}

	async create(dto: CreateCollectionPointDto): Promise<CollectionPoint> {
		const newDocument = new this.collectionPointModel(dto);
		return newDocument.save();
	}

	async update(
		id: string,
		dto: UpdateCollectionPointDto
	): Promise<CollectionPoint | null> {
		return this.collectionPointModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
	}

	async delete(id: string): Promise<CollectionPoint | null> {
		return this.collectionPointModel.findByIdAndDelete(id).exec();
	}

	async findActive(): Promise<CollectionPoint[]> {
		return this.collectionPointModel
			.find({ is_active: true })
			.populate("container_type_id")
			.sort({ order: 1 })
			.exec();
	}
}
