import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Geofence, GeofenceSchema } from "./schema/geofence.schema";
import { GeofenceController } from "./geofence.controller";
import { GeofenceService } from "./geofence.service";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";

@Module({
    imports: [MongooseModule.forFeature([{ name: Geofence.name, schema: GeofenceSchema }], ROBIN_SERVER_DB_NAME)],
    controllers: [GeofenceController],
    providers: [GeofenceService],
    exports: [GeofenceService]
})
export class GeofenceModule { }
//  implements OnApplicationBootstrap {
//     constructor(
//         private readonly geofenceService: GeofenceService
//     ) { }

//     async onApplicationBootstrap() {
//         await this.geofenceService.onApplicationBootstrap();
//     }
// }