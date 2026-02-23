import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type LocationPointDocument = LocationPoint & Document;

@Schema({ _id: false })
class Location {
	@Prop({ type: Number, required: true })
	latitude: number;

	@Prop({ type: Number, required: true })
	longitude: number;
}

@Schema({ _id: false })
class OperatingHours {
	@Prop({ type: String, required: false })
	open?: string; // Formato "HH:mm"

	@Prop({ type: String, required: false })
	close?: string; // Formato "HH:mm"
}

export enum LocationPointType {
	STARTING_POINT = "starting_point",
	ENDING_POINT = "ending_point",
	DUMP_SITE = "dump_site",
	TRANSFER_STATION = "transfer_station",
}

@Schema({
	_id: true,
	id: true,
	timestamps: true,
	versionKey: false,
	collection: "location_points",
})
export class LocationPoint {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({
		type: String,
		enum: Object.values(LocationPointType),
		required: true,
	})
	type: LocationPointType;

	@Prop({ type: Location, required: true })
	location: Location;

	@Prop({ type: Number, required: true, default: 50 })
	geofence_radius: number; // metros

	@Prop({ type: String, required: false })
	icon_url?: string; // Ruta del icono subido

	@Prop({ type: String, required: false })
	color?: string; // Color hexadecimal (#RRGGBB)

	@Prop({ type: String, required: false })
	description?: string;

	@Prop({ type: String, required: false })
	address?: string; // Dirección física

	@Prop({ type: OperatingHours, required: false })
	operating_hours?: OperatingHours;

	@Prop({ type: Number, required: false })
	capacity?: number; // Capacidad en toneladas

	@Prop({ type: String, required: false })
	contact_phone?: string;

	@Prop({ type: String, required: false })
	contact_name?: string;

	@Prop({ type: Boolean, required: true, default: true })
	is_active: boolean;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: "Municipality",
		required: false,
	})
	municipality_id?: mongoose.Types.ObjectId;
}

export const LocationPointSchema = SchemaFactory.createForClass(LocationPoint);
