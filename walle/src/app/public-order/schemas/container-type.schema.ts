import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ContainerTypeDocument = ContainerType & Document;

@Schema({
	_id: true,
	id: true,
	timestamps: true,
	versionKey: false,
	collection: "container_types",
})
export class ContainerType {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Number, required: true })
	capacity: number; // Capacidad en litros

	@Prop({ type: Number, required: true })
	acquisition_year: number;

	@Prop({ type: String, required: false })
	icon_url?: string; // Ruta del icono subido al servidor

	@Prop({ type: String, required: false })
	material?: string; // Material: "plastic", "metal", "hdpe", etc.

	@Prop({
		type: String,
		enum: ["general", "organic", "recyclable", "hazardous", "glass", "paper"],
		required: false,
	})
	waste_type?: string; // Tipo de residuo

	@Prop({ type: String, required: false })
	color?: string; // Color del contenedor (hex o nombre)

	@Prop({ type: String, required: false })
	description?: string;

	@Prop({ type: Boolean, required: true, default: true })
	is_active: boolean;
}

export const ContainerTypeSchema = SchemaFactory.createForClass(ContainerType);
