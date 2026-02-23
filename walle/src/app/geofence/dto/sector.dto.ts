import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class SectorD {
    @IsString()
    @IsNotEmpty()
    sector_name: string;

    @IsString()
    @IsOptional()
    sector_description: string;

    @IsString()
    @IsOptional()
    sector_color: string;

    @IsString()
    @IsOptional()
    excel_file: string;

    @IsObject()
    @IsOptional()
    geometry: Object
}