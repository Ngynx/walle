import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class VehicleD {
    @IsNotEmpty()
    @IsString()
    vehicle_brand: string;

    @IsNotEmpty()
    @IsString()
    vehicle_model: string;

    @IsNotEmpty()
    @IsString()
    vehicle_license_plate: string;

    @IsNotEmpty()
    @IsString()
    vehicle_type_description_model: string;

    @IsNotEmpty()
    @IsNumber()
    vehicle_device_imei: number;

    @IsOptional()
    @IsString()
    vehicle_alias: string;

    @IsOptional()
    @IsBoolean()
    vehicle_sipcop_tracking_send_data_realtime?: boolean;

    @IsOptional()
    @IsBoolean()
    vehicle_police_sipcop: boolean; // TRUE = POLICE; FALSE = any other

    @IsString()
    @IsOptional()
    vehicle_police_station_code: string;

    @IsOptional()
    @IsBoolean()
    vehicle_sipcop_tracking_send_data:boolean

    @IsOptional()
    @IsBoolean()
    vehicle_sipcop_tracking_type_auxiliary?: boolean;

    @IsString()
    @IsOptional()
    vehicle_auxiliary_license_plate?: string;

    @IsNumber()
    @IsOptional()
    vehicle_auxiliary_device_imei?: number;

    @IsString()
    @IsOptional()
    vehicle_auxiliary_phone_number?: string;

    @IsString()
    @IsOptional()
    vehicle_auxiliary_alias?: string;

    @IsNumber()
    @IsOptional()
    vehicle_gallons_per_km?: number;
}