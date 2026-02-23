import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CollectionPoint } from "./collection-point.schema";

export type CollectionRouteDocument = CollectionRoute & Document;

@Schema({ _id: false })
class PathCoordinate {
	@Prop({ type: Number, required: true })
	lat: number;

	@Prop({ type: Number, required: true })
	lng: number;
}

@Schema({ _id: false })
class Waypoint {
	@Prop({ type: Number, required: true })
	lat: number;

	@Prop({ type: Number, required: true })
	lng: number;

	@Prop({ type: Number, required: true })
	order: number; // Orden del waypoint en la ruta
}

@Schema({
	_id: true,
	id: true,
	timestamps: true,
	versionKey: false,
	collection: "collection_routes",
})
export class CollectionRoute {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: false, default: "" })
	description: string;

	@Prop({ type: String, required: false, default: "#3B82F6" })
	color: string; // Color hexadecimal para identificar la ruta en el mapa

	@Prop({ type: [Waypoint], required: false, default: [] })
	waypoints: Waypoint[]; // Puntos para dirigir la ruta (NO son puntos de recojo)

	@Prop({
		type: [{ type: Types.ObjectId, ref: "CollectionPoint" }],
		required: false,
		default: [],
	})
	collection_points: Types.ObjectId[] | CollectionPoint[];

	@Prop({ type: [PathCoordinate], required: false })
	generated_path?: PathCoordinate[];

	@Prop({ type: Number, required: true, default: 0 })
	estimated_duration: number; // minutos

	@Prop({ type: Boolean, required: true, default: true })
	is_active: boolean;
}

export const CollectionRouteSchema =
	SchemaFactory.createForClass(CollectionRoute);
