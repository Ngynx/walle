import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GeofenceService } from "./geofence.service";
import { GeofenceD } from "./dto/geofence.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { FilesGeofenceDocI } from "./interface/uploadfiles.interface";
import { UpdatedSectorD } from "./dto/sector.update.dto";
import { SectorD } from "./dto/sector.dto";
import { Auth } from "src/common/decorators";
import { RandomName, geofenceFileFilter } from "src/common/helpers/multer.utils";


@ApiTags("Geofence module")
@Controller('geofence')
export class GeofenceController {
    constructor(
        private readonly geofenceService: GeofenceService
    ) { }

    // @Auth()
    @Get('')
    async getDocuments(
        @Res() res: any
    ): Promise<any> {
        try {
            const documents = await this.geofenceService.getDocuments();
            res.status(200)
            return res.json({
                success: documents.length > 0 ? true : false,
                data: documents,
                message: documents.length > 0 ? "Data received" : "Data empty"
            });
        } catch (error) {
            console.log(error)
            res.status(400);
            return res.json({
                success: false,
                data: null,
                message: 'Opps! Ocurred an error!'
            })
        }
    }

    // @Auth()
    @Get(':id')
    async getOneById(
        @Param('id') id: string,
        @Res() res: any
    ): Promise<any> {
        try {
            const document = await this.geofenceService.getOneById(id);
            res.status(200);
            return res.json({
                success: document ? true : false,
                data: document,
                message: document ? 'Data received!' : "Data empty"
            });
        } catch (error) {
            console.log(error)
            res.status(400);
            return res.json({
                success: false,
                data: null,
                message: 'Opps! Ocurred an error!'
            })
        }
    };

}