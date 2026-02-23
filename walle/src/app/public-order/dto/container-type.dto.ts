import {
	IsString,
	IsNumber,
	IsBoolean,
	IsOptional,
	IsEnum,
} from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class CreateContainerTypeDto {
	@IsString()
	name: string;

	@IsNumber()
	capacity: number;

	@IsNumber()
	acquisition_year: number;

	@IsOptional()
	@IsString()
	icon_url?: string;

	@IsOptional()
	@IsString()
	material?: string;

	@IsOptional()
	@IsEnum(["general", "organic", "recyclable", "hazardous", "glass", "paper"])
	waste_type?: string;

	@IsOptional()
	@IsString()
	color?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsBoolean()
	is_active?: boolean;
}

export class UpdateContainerTypeDto extends PartialType(
	CreateContainerTypeDto
) {}
