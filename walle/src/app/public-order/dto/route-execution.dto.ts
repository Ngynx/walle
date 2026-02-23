import {
	IsString,
	IsNumber,
	IsOptional,
	IsArray,
	ValidateNested,
	IsDateString,
	IsEnum,
} from "class-validator";
import { Type } from "class-transformer";

class PointSummaryDto {
	@IsString()
	collection_point_id: string;

	@IsString()
	collection_point_name: string;

	@IsDateString()
	arrival_time: string;

	@IsDateString()
	departure_time: string;

	@IsNumber()
	stop_duration: number;

	@IsNumber()
	travel_time_from_previous: number;

	@IsEnum(["COMPLIANT", "UNDER_TIME", "OVER_TIME"])
	compliance_status: "COMPLIANT" | "UNDER_TIME" | "OVER_TIME";
}

export class CreateRouteExecutionDto {
	@IsString()
	route_id: string;

	@IsString()
	route_name: string;

	@IsString()
	vehicle_id: string;

	@IsString()
	vehicle_plate: string;

	@IsDateString()
	start_time: string;

	@IsDateString()
	end_time: string;

	@IsNumber()
	total_duration: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PointSummaryDto)
	point_summaries: PointSummaryDto[];

	@IsEnum(["COMPLIANT", "UNDER_TIME", "OVER_TIME"])
	overall_compliance: "COMPLIANT" | "UNDER_TIME" | "OVER_TIME";
}

export class DateRangeQueryDto {
	@IsOptional()
	@IsString()
	start?: string; // YYYY-MM-DD

	@IsOptional()
	@IsString()
	end?: string; // YYYY-MM-DD
}

export class PaginationQueryDto {
	@IsOptional()
	@IsString()
	page?: string;

	@IsOptional()
	@IsString()
	limit?: string;
}
