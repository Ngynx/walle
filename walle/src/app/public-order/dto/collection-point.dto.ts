import {
	IsString,
	IsNumber,
	IsBoolean,
	IsOptional,
	IsObject,
	ValidateNested,
	IsEnum,
	IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/swagger";

class LocationDto {
	@IsNumber()
	latitude: number;

	@IsNumber()
	longitude: number;
}

class CoordinateDto {
	@IsNumber()
	lat: number;

	@IsNumber()
	lng: number;
}

class GeofenceAreaDto {
	@IsEnum(["circle", "polygon"])
	type: "circle" | "polygon";

	@IsOptional()
	@IsNumber()
	radius?: number;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CoordinateDto)
	coordinates?: CoordinateDto[];
}

export class CreateCollectionPointDto {
	@IsString()
	name: string;

	@IsObject()
	@ValidateNested()
	@Type(() => LocationDto)
	location: LocationDto;

	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => GeofenceAreaDto)
	geofence_area?: GeofenceAreaDto;

	@IsNumber()
	min_stop_time: number;

	@IsNumber()
	max_stop_time: number;

	@IsOptional()
	@IsNumber()
	order?: number;

	@IsOptional()
	@IsBoolean()
	is_active?: boolean;

	@IsOptional()
	@IsBoolean()
	has_container?: boolean;

	@IsOptional()
	@IsString()
	container_type_id?: string; // ObjectId como string
}

export class UpdateCollectionPointDto extends PartialType(
	CreateCollectionPointDto
) {}
