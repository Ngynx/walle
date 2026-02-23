import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SectorDocument = Sector & Document;
@Schema({
    _id: true,
    id: true,
    timestamps: true,
    versionKey: false
})
export class Sector {
    @Prop({
        type: String,
        required: false
    })
    sector_name?: string;

    @Prop({
        type: String,
        required: false
    })
    sector_description?: string;

    @Prop({
        type: String,
        required: false
    })
    sector_color?: string;

    @Prop({
        type: String,
        required: false
    })
    excel_file?: string;

    @Prop({
        type: {
            type: String,
            enum: ['Polygon'],
            required: true,
            default: 'Polygon'
        },
        coordinates: {
            type: [[[Number]]],
            required: true
        }
    })
    geometry: Object;
}

export const SectorSchema = SchemaFactory.createForClass(Sector);