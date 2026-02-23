import {
	IsString,
	IsNumber,
	IsBoolean,
	IsOptional,
	IsEnum,
	ValidateNested,
	IsObject,
	Min,
	Matches,
} from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { LocationPointType } from "../schemas/location-point.schema";

class LocationDto {
	@IsNumber()
	latitude: number;

	@IsNumber()
	longitude: number;
}

class OperatingHoursDto {
	@IsOptional()
	@IsString()
	@Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: "open must be in HH:mm format",
	})
	open?: string;

	@IsOptional()
	@IsString()
	@Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: "close must be in HH:mm format",
	})
	close?: string;
}

export class CreateLocationPointDto {
	@IsString()
	name: string;

	@IsEnum(LocationPointType)
	type: LocationPointType;

	@IsObject()
	@ValidateNested()
	@Type(() => LocationDto)
	location: LocationDto;

	@IsNumber()
	@Min(1)
	geofence_radius: number;

	@IsOptional()
	@IsString()
	icon_url?: string;

	@IsOptional()
	@IsString()
	@Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
		message: "color must be a valid hex color (e.g., #FF5733)",
	})
	color?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	address?: string;

	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => OperatingHoursDto)
	operating_hours?: OperatingHoursDto;

	@IsOptional()
	@IsNumber()
	@Min(0)
	capacity?: number;

	@IsOptional()
	@IsString()
	contact_phone?: string;

	@IsOptional()
	@IsString()
	contact_name?: string;

	@IsOptional()
	@IsBoolean()
	is_active?: boolean;

	@IsOptional()
	@IsString()
	municipality_id?: string;
}

export class UpdateLocationPointDto extends PartialType(
	CreateLocationPointDto
) {}
