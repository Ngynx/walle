import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ContainerType } from "./container-type.schema";

export type CollectionPointDocument = CollectionPoint & Document;

@Schema({ timestamps: true, versionKey: false })
class Location {
	@Prop({ type: Number, required: true })
	latitude: number;

	@Prop({ type: Number, required: true })
	longitude: number;
}

@Schema({ _id: false })
class Coordinate {
	@Prop({ type: Number, required: true })
	lat: number;

	@Prop({ type: Number, required: true })
	lng: number;
}

@Schema({ _id: false })
class GeofenceArea {
	@Prop({ type: String, enum: ["circle", "polygon"], required: true })
	type: "circle" | "polygon";

	@Prop({ type: Number, required: false })
	radius?: number; // metros, para círculos

	@Prop({ type: [Coordinate], required: false })
	coordinates?: Coordinate[]; // para polígonos
}

@Schema({
	_id: true,
	id: true,
	timestamps: true,
	versionKey: false,
	collection: "collection_points",
})
export class CollectionPoint {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Location, required: true })
	location: Location;

	@Prop({ type: GeofenceArea, required: false })
	geofence_area?: GeofenceArea;

	@Prop({ type: Number, required: true })
	min_stop_time: number; // segundos

	@Prop({ type: Number, required: true })
	max_stop_time: number; // segundos

	@Prop({ type: Number, required: true, default: 0 })
	order: number;

	@Prop({ type: Boolean, required: true, default: true })
	is_active: boolean;

	@Prop({ type: Boolean, required: true, default: false })
	has_container: boolean; // ¿Tiene contenedor asignado?

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: "ContainerType",
		required: false,
	})
	container_type_id?: ContainerType; // Referencia al tipo de contenedor
}

export const CollectionPointSchema =
	SchemaFactory.createForClass(CollectionPoint);
