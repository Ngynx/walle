import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KmlI } from '../interface/kml.interface';
import { Sector, SectorSchema } from './sector.schema';

export type GeofenceDocument = Geofence & Document;

@Schema({
    _id: true,
    id: true,
    timestamps: true,
    versionKey: false
})
export class Geofence {

    @Prop({
        type: String,
        required: false
    })
    name: string;

    @Prop({
        required: false
    })
    coordinates: Number[];

    @Prop({
        type: String,
        required: false
    })
    excel_filename: string; 

    @Prop({
        type: Object,
        required: false
    })
    kml_filename: KmlI;

    @Prop({
        type: String,
        required: false
    })
    template: string;

    @Prop({
        type: String,
        required: false
    })
    upload_type: string;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    show_sector: boolean;

    @Prop({
        type: {    
            type: String,
            enum: ['Polygon'],
            required: false,
            default: 'Polygon'
        },
        coordinates: {
            type: [[[Number]]],
            required: false,
        },
    })
    geometry: Object;

    @Prop({
        type: [SectorSchema]
    })
    sectoring: Sector[];

}

export const GeofenceSchema = SchemaFactory.createForClass(Geofence);
// GeofenceSchema.index({ 'geometry.coordinates': '2dsphere' });
// GeofenceSchema.index({
//   "geometry": 1,
//   "sectoring": 1
// });