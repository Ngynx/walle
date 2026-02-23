import {
	IsString,
	IsNumber,
	IsBoolean,
	IsOptional,
	IsArray,
	ValidateNested,
	Min,
	Max,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/swagger";

class DailyAssignmentDto {
	@IsString()
	vehicle_id: string;

	@IsOptional()
	@IsString()
	vehicle_plate?: string;

	@IsString()
	route_id: string;

	@IsOptional()
	@IsString()
	route_name?: string;

	@IsString()
	scheduled_start_time: string; // HH:mm
}

class DayAssignmentsDto {
	@IsNumber()
	@Min(1)
	@Max(31)
	day: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => DailyAssignmentDto)
	assignments: DailyAssignmentDto[];
}

export class CreateMonthlyPlanDto {
	@IsNumber()
	@Min(1)
	@Max(12)
	month: number;

	@IsNumber()
	year: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => DayAssignmentsDto)
	daily_assignments: DayAssignmentsDto[];

	@IsOptional()
	@IsString()
	created_by?: string;

	@IsOptional()
	@IsBoolean()
	is_active?: boolean;
}

export class UpdateMonthlyPlanDto extends PartialType(CreateMonthlyPlanDto) {}
