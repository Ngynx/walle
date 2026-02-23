import { Types } from "mongoose";

export interface VehicleI {
    _id?: Types.ObjectId;
    id?: string;
    vehicle_alias: string;
    vehicle_brand: string;
    vehicle_model: string;
    vehicle_license_plate: string;
    vehicle_type_description_model: string;
    vehicle_device_imei: number;
    vehicle_sipcop_tracking_send_data_realtime?: boolean;
    createdAt?: string|Date;
    updatedAt?: string|Date;
    vehicle_police_sipcop: boolean; // TRUE = POLICE; FALSE = any other
    vehicle_police_station_code: string;
    vehicle_sipcop_tracking_send_data?: boolean;
    vehicle_sipcop_tracking_type_auxiliary?: boolean;
    vehicle_auxiliary_license_plate?: string;
    vehicle_auxiliary_device_imei?: string;
    vehicle_auxiliary_phone_number?: string;
    vehicle_auxiliary_alias?: string;
    vehicle_gallons_per_km?: number;
}