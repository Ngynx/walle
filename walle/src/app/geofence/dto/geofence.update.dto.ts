import { OmitType } from "@nestjs/swagger";
import { GeofenceD } from "./geofence.dto";

export class GeofenceUpdateD extends OmitType(GeofenceD, ["template"] as const ) {}