import { IsArray, IsBoolean, IsObject, IsOptional, IsString } from "class-validator";
import { KmlI } from "../interface/kml.interface";

export class GeofenceD {
    
    @IsOptional()
    @IsString()
    name: string;
    
    @IsOptional()
    @IsArray()
    coordinates: Number[];
    
    @IsOptional()
    @IsString()
    excel_filename: string; 
    
    @IsOptional()
    @IsObject()
    kml_filename: KmlI;
    
    @IsOptional()
    @IsString()
    template: string;

    @IsOptional()
    @IsString()
    upload_type: string;
    
    @IsOptional()
    @IsBoolean()
    show_sector: boolean;
    
    @IsOptional()
    @IsObject()
    geometry: Object;
    
    @IsOptional()
    @IsArray()
    sectoring: [Object];
}