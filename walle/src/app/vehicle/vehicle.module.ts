import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Vehicle, VehicleSchema } from "./schema/vehicle.schema";
import { VehicleService } from "./vehicle.service";
import { VehicleController } from "./vehicle.controller";
import { DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant";

@Module({
    imports: [MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }], DELTA_DISPATCH_DB_NAME)],
    controllers: [VehicleController],
    providers: [VehicleService],
    exports: [VehicleService]
})
export class VehicleModule { }