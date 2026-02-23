import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MonthlyGarbagePlanDocument = MonthlyGarbagePlan & Document;

@Schema({ _id: false })
class DailyAssignment {
	@Prop({ type: String, required: true })
	vehicle_id: string;

	@Prop({ type: String, required: false })
	vehicle_plate?: string;

	@Prop({ type: String, required: true })
	route_id: string;

	@Prop({ type: String, required: false })
	route_name?: string;

	@Prop({ type: String, required: true })
	scheduled_start_time: string; // HH:mm
}

@Schema({ _id: false })
class DayAssignments {
	@Prop({ type: Number, required: true })
	day: number; // 1-31

	@Prop({ type: [DailyAssignment], required: true, default: [] })
	assignments: DailyAssignment[];
}

@Schema({
	_id: true,
	id: true,
	timestamps: true,
	versionKey: false,
	collection: "monthly_garbage_plans",
})
export class MonthlyGarbagePlan {
	@Prop({ type: Number, required: true, min: 1, max: 12 })
	month: number; // 1-12

	@Prop({ type: Number, required: true })
	year: number;

	@Prop({ type: [DayAssignments], required: true, default: [] })
	daily_assignments: DayAssignments[];

	@Prop({ type: String, required: false })
	created_by?: string;

	@Prop({ type: Boolean, required: true, default: true })
	is_active: boolean;
}

export const MonthlyGarbagePlanSchema =
	SchemaFactory.createForClass(MonthlyGarbagePlan);
