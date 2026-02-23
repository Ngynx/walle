import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
	CreateCollectionRouteDto,
	UpdateCollectionRouteDto,
} from "../dto/collection-route.dto";
import {
	CollectionRoute,
	CollectionRouteDocument,
} from "../schemas/collection-route.schema";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";

@Injectable()
export class CollectionRouteService {
	constructor(
		@InjectModel(CollectionRoute.name, ROBIN_SERVER_DB_NAME)
		private readonly collectionRouteModel: Model<CollectionRouteDocument>
	) { }

	async findAll(): Promise<CollectionRoute[]> {
		return this.collectionRouteModel
			.find()
			.populate({
				path: "collection_points",
				populate: { path: "container_type_id" },
			})
			.sort({ createdAt: -1 })
			.exec();
	}

	async findById(id: string): Promise<CollectionRoute | null> {
		return this.collectionRouteModel
			.findById(id)
			.populate({
				path: "collection_points",
				populate: { path: "container_type_id" },
			})
			.exec();
	}

	async create(dto: CreateCollectionRouteDto): Promise<CollectionRoute> {
		const newDocument = new this.collectionRouteModel(dto);
		return newDocument.save();
	}

	async update(
		id: string,
		dto: UpdateCollectionRouteDto
	): Promise<CollectionRoute | null> {
		return this.collectionRouteModel
			.findByIdAndUpdate(id, dto, { new: true })
			.populate({
				path: "collection_points",
				populate: { path: "container_type_id" },
			})
			.exec();
	}

	async delete(id: string): Promise<CollectionRoute | null> {
		return this.collectionRouteModel.findByIdAndDelete(id).exec();
	}

	async findActive(): Promise<CollectionRoute[]> {
		return this.collectionRouteModel
			.find({ is_active: true })
			.populate({
				path: "collection_points",
				populate: { path: "container_type_id" },
			})
			.exec();
	}
}
