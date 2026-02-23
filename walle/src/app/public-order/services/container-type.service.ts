import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
	ContainerType,
	ContainerTypeDocument,
} from "../schemas/container-type.schema";
import {
	CreateContainerTypeDto,
	UpdateContainerTypeDto,
} from "../dto/container-type.dto";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";

@Injectable()
export class ContainerTypeService {
	constructor(
		@InjectModel(ContainerType.name, ROBIN_SERVER_DB_NAME)
		private readonly containerTypeModel: Model<ContainerTypeDocument>
	) { }

	async findAll(): Promise<ContainerType[]> {
		return this.containerTypeModel.find().sort({ name: 1 }).exec();
	}

	async findActive(): Promise<ContainerType[]> {
		return this.containerTypeModel
			.find({ is_active: true })
			.sort({ name: 1 })
			.exec();
	}

	async findById(id: string): Promise<ContainerType | null> {
		return this.containerTypeModel.findById(id).exec();
	}

	async create(dto: CreateContainerTypeDto): Promise<ContainerType> {
		const newDocument = new this.containerTypeModel(dto);
		return newDocument.save();
	}

	async update(
		id: string,
		dto: UpdateContainerTypeDto
	): Promise<ContainerType | null> {
		return this.containerTypeModel
			.findByIdAndUpdate(id, dto, { new: true })
			.exec();
	}

	async delete(id: string): Promise<ContainerType | null> {
		return this.containerTypeModel.findByIdAndDelete(id).exec();
	}

	async updateIcon(id: string, iconUrl: string): Promise<ContainerType | null> {
		return this.containerTypeModel
			.findByIdAndUpdate(id, { icon_url: iconUrl }, { new: true })
			.exec();
	}
}
