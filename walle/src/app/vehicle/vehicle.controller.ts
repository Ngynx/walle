import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { VehicleService } from "./vehicle.service";
import { Response } from "express";
import { ApiQuery } from "@nestjs/swagger";

@Controller('vehicle')
export class VehicleController {
    constructor(
        private readonly vehicleService: VehicleService
    ) { }

    @Post('')
    async getDocumentByFieldname(
        @Res() res: Response,
        @Body() dto: any
    ): Promise<Response<object>> {
        try {
            const data = await this.vehicleService.getOneByFieldname(dto.fieldName, dto.value);
            res.status(200);
            return res.json({
                success: true,
                data: data,
                message: "Data"
            })
        } catch (error) {
            console.log(error);
            res.status(400);
            return res.json({
                success: false,
                data: error,
                message: 'Opps! has ocurred and error!'
            })
        }
    }


    @Get('vehicle/sipcop/pagination')
    @ApiQuery({ name: 'page', required: true })
    @ApiQuery({ name: 'rows', required: false })
    @ApiQuery({ name: 'workgroup_name', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'orderField', required: false })
    @ApiQuery({ name: 'orderSense', required: false })
    async get_all_documents_vehicle_sipcop(
        @Res() res: any,
        @Query('page') page?: string,
        @Query('rows') rows?: string,
        @Query('workgroup_name') workgroup_name?: string,
        @Query('search') search?: string,
        @Query('orderField') orderField?: string,
        @Query('orderSense') orderSense?: string,
    ): Promise<any> {
        try {
            const vehicles = await this.vehicleService.get_all_documents_pagination(
                page && Number(page) as any,
                rows && Number(rows) as any,
                workgroup_name as any,
                search,
                orderField,
                orderSense && Number(orderSense) as any
            ) as unknown[];
            if (vehicles.length > 0) {
                res.status(200)
                return res.json({
                    success: true,
                    data: vehicles,
                    message: 'Data received'
                })
            } else {
                res.status(200)
                return res.json({
                    success: false,
                    data: [],
                    message: 'Data empty'
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400)
            return res.json({
                success: false,
                data: null,
                message: 'Ocurred an error'
            })
        }
    }



    @Get('vehicle/sipcop/period')
    @ApiQuery({ name: 'workgroup_name', required: false })
    async get_all_documents_vehicle_sipcop_period(
        @Res() res: any,
        @Query('workgroup_name') workgroup_name?: string,
    ): Promise<any> {
        try {
            const vehicles = await this.vehicleService.get_all_documents_vehicle_sipcop_period(workgroup_name as any) as unknown[];
            if (vehicles.length > 0) {
                res.status(200)
                return res.json({
                    success: true,
                    data: vehicles,
                    message: 'Data received'
                })
            } else {
                res.status(200)
                return res.json({
                    success: false,
                    data: [],
                    message: 'Data empty'
                })
            }
        } catch (error) {
            console.log(error)
            res.status(400)
            return res.json({
                success: false,
                data: null,
                message: 'Ocurred an error'
            })
        }
    }
}