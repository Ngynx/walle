import {
	IsString,
	IsNumber,
	IsBoolean,
	IsOptional,
	IsArray,
	ValidateNested,
	Matches,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/swagger";

class PathCoordinateDto {
	@IsNumber()
	lat: number;

	@IsNumber()
	lng: number;
}

class WaypointDto {
	@IsNumber()
	lat: number;

	@IsNumber()
	lng: number;

	@IsNumber()
	order: number;
}

export class CreateCollectionRouteDto {
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
		message: "color must be a valid hex color (e.g., #3B82F6)",
	})
	color?: string;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => WaypointDto)
	waypoints?: WaypointDto[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	collection_points?: string[]; // ObjectId strings - ahora opcional

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PathCoordinateDto)
	generated_path?: PathCoordinateDto[];

	@IsNumber()
	estimated_duration: number;

	@IsOptional()
	@IsBoolean()
	is_active?: boolean;
}

export class UpdateCollectionRouteDto extends PartialType(
	CreateCollectionRouteDto
) {}
