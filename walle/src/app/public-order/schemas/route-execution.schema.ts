import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RouteExecutionSummaryDocument = RouteExecutionSummary & Document;

export type ComplianceStatus = "COMPLIANT" | "UNDER_TIME" | "OVER_TIME";

@Schema({ _id: false })
class PointSummary {
	@Prop({ type: String, required: true })
	collection_point_id: string;

	@Prop({ type: String, required: true })
	collection_point_name: string;

	@Prop({ type: Date, required: true })
	arrival_time: Date;

	@Prop({ type: Date, required: true })
	departure_time: Date;

	@Prop({ type: Number, required: true })
	stop_duration: number; // segundos

	@Prop({ type: Number, required: true, default: 0 })
	travel_time_from_previous: number; // segundos

	@Prop({
		type: String,
		enum: ["COMPLIANT", "UNDER_TIME", "OVER_TIME"],
		required: true,
	})
	compliance_status: ComplianceStatus;
}

@Schema({
	_id: true,
	id: true,
	timestamps: true,
	versionKey: false,
	collection: "route_execution_summaries",
})
export class RouteExecutionSummary {
	@Prop({ type: String, required: true })
	route_id: string;

	@Prop({ type: String, required: true })
	route_name: string;

	@Prop({ type: String, required: true })
	vehicle_id: string;

	@Prop({ type: String, required: true })
	vehicle_plate: string;

	@Prop({ type: Date, required: true })
	start_time: Date;

	@Prop({ type: Date, required: true })
	end_time: Date;

	@Prop({ type: Number, required: true })
	total_duration: number; // segundos

	@Prop({ type: [PointSummary], required: true, default: [] })
	point_summaries: PointSummary[];

	@Prop({
		type: String,
		enum: ["COMPLIANT", "UNDER_TIME", "OVER_TIME"],
		required: true,
	})
	overall_compliance: ComplianceStatus;
}

export const RouteExecutionSummarySchema = SchemaFactory.createForClass(
	RouteExecutionSummary
);
