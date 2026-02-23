import { OmitType } from "@nestjs/swagger";
import { SectorD } from "./sector.dto";

export class UpdatedSectorD extends OmitType(SectorD, ["excel_file", "geometry"] as const ) { }