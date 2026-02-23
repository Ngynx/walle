import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type VehicleDocument = Vehicle & Document;

@Schema({
	_id: true,
	id: true,
	timestamps: true,
	versionKey: false,
})
export class Vehicle {
	@Prop({
		type: String,
		required: false,
	})
	vehicle_brand: string;

	@Prop({
		type: String,
		required: false,
	})
	vehicle_model: string;

	@Prop({
		type: String,
		required: false,
	})
	vehicle_license_plate: string;

	@Prop({
		type: String,
		required: false,
	})
	vehicle_type_description_model: string;

	@Prop({
		type: Number,
		required: false,
	})
	vehicle_device_imei: number;

	@Prop({
		type: String,
		required: false,
	})
	vehicle_alias: string;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	vehicle_sipcop_tracking_send_data_realtime?: boolean;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	vehicle_police_sipcop?: boolean;

	@Prop({
		type: String,
		required: false,
	})
	vehicle_police_station_code?: string;

	@Prop({
		type: String,
		required: false,
	})
	vehicle_workgroup_name?: string;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	vehicle_sipcop_tracking_send_data?: boolean;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	vehicle_sipcop_tracking_type_auxiliary?: boolean;

	@Prop({
		type: String,
		required: false,
	})
	vehicle_auxiliary_license_plate?: string;

	@Prop({
		type: Number,
		required: false,
	})
	vehicle_auxiliary_device_imei?: number;

	@Prop({
		type: String,
		required: false,
	})
	vehicle_auxiliary_phone_number?: string;

	@Prop({
		type: String,
		required: false,
	})
	vehicle_auxiliary_alias?: string;

	@Prop({
		type: Number,
		required: false,
		default: 0,
	})
	vehicle_gallons_per_km?: number;

	@Prop({
		type: String,
		enum: ["PATROL", "PUBLIC_ORDER"],
		default: "PATROL",
	})
	vehicle_operation_type?: "PATROL" | "PUBLIC_ORDER";

	@Prop({
		type: String,
		enum: ["GARBAGE_COLLECTION", "CISTERNA"],
		required: false,
	})
	public_order_subtype?: "GARBAGE_COLLECTION" | "CISTERNA";
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
