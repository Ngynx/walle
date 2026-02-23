import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";
import { Vehicle, VehicleDocument } from "./schema/vehicle.schema";
import { VehicleD } from "./dto/vehicle.dto";
import { Types } from 'mongoose';
import { DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant";

@Injectable()
export class VehicleService {
    constructor(
        @InjectModel(Vehicle.name, DELTA_DISPATCH_DB_NAME)
        private readonly vehicleModel: Model<VehicleDocument>,
        // private readonly periodService: PeriodService
    ) { }

    async getDocuments(): Promise<VehicleD[]> {
        return await this.vehicleModel.find();
    };

    async getUniquesVehicleImeis() {
        const baseDoc = await this.vehicleModel
            .distinct("vehicle_device_imei", { $and: [{ vehicle_device_imei: { $ne: null } }, { vehicle_device_imei: { $exists: true } }] })
            .lean();
        return baseDoc;
    };

    async getUniquesVehicleImeisAvailables() {
        const baseDoc = await this.vehicleModel
            .distinct("vehicle_device_imei", { $and: [{ vehicle_device_imei: { $ne: null } }, { vehicle_device_imei: { $exists: true } }, { vehicle_sipcop_tracking_send_data: true }] })
            .lean();
        return baseDoc;
    };

    async getAllImei() {
        const baseDoc = await this.vehicleModel
            .find({ $and: [{ vehicle_device_imei: { $ne: null } }, { vehicle_device_imei: { $exists: true } }] })
            .select("vehicle_device_imei")
            .lean();

        return baseDoc;
    };

    async getOneByFieldname<T>(fieldName: keyof (VehicleDocument), value: T): Promise<any> {
        if (fieldName === '_id') {
            return await this.vehicleModel.findById(value);
        } else {
            return await this.vehicleModel.findOne({
                [fieldName]: [value]
            });
        }
    };

    async findByWorkgroup(workgroupName: string): Promise<any> {
        return this.vehicleModel.find(
            { vehicle_workgroup_name: workgroupName },
            { vehicle_device_imei: 1 } // solo selecciona el campo imei
        ).lean();
    }


    async get_all_documents_pagination(
        page: number = 0,
        rows: number = 20,
        workgroup_name: string,
        searchF: string = '',
        orderField: string = 'createdAt',
        orderSense: number = -1
    ): Promise<Vehicle[]> {
        // const period = await this.periodService.getOneActive()
        //const operative_state: StateDocument = await this.state_service.get_one_by_name(OPERATIVE);

        // const periodVehicleIds = period.vehicles.map(v =>
        //     new Types.ObjectId(v._id) // aseguramos que sean ObjectId
        // ); // IDs de los vehículos del periodo

        const search = searchF.replace(/^0+/, '')
        //order fields
        const sortOperator: PipelineStage.Sort = {
            $sort: {
                inPeriod: -1,  // primero los del periodo
                [orderField]: orderSense as 1 | -1 // luego el orden dinámico
            }
        };
        //pagination
        const { offset, limit } = this.getPagination(page, rows);
        //filters
        const query = this.filterOptions({ workgroup_name });

        //search query
        const querySearch = {
            $or: [
                {
                    vehicle_license_plate: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    vehicle_type_description_model: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    vehicle_brand: {
                        $regex: search,
                        $options: 'i'
                    }
                },

                {
                    vehicle_model: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    vehicle_alias: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    vehicle_device_imei: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    workgroup_name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    'vehicle_gps_type.brand': {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    'vehicle_gps_type.models': {
                        $regex: search,
                        $options: 'i'
                    }
                },

                {
                    'vehicle_gps.gps_phone_number': {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    'vehicle_gps.gps_codec': {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: { $toLong: "$vehicle_device_imei" } },
                            regex: search,
                            options: 'i'
                        }
                    }
                }
            ]
        };

        const data = await this.vehicleModel.aggregate([
            // joins
            {
                $lookup: {
                    from: 'gps',
                    localField: "vehicle_device_imei",
                    foreignField: "gps_device_imei",
                    as: 'vehicle_gps'
                }
            },
            {
                $lookup: {
                    from: 'typeofgps',
                    localField: "vehicle_gps.typeof_gps_id._id",
                    foreignField: "_id",
                    as: 'vehicle_gps_type'
                }
            },

            // filtros
            {
                $match: {
                    $and: [
                        query,
                        querySearch,
                        { vehicle_sipcop_tracking: true }
                    ]
                }
            },

            // marcar si está en el periodo activo
            // {
            //     $addFields: {
            //         inPeriod: { $in: ["$_id", periodVehicleIds] }
            //     }
            // },

            // ordenar: primero los del periodo, luego el orden que ya usabas
            sortOperator,

            {
                $facet: {
                    stage1: [{ $count: "count" }],
                    stage2: [{ $skip: offset }, { $limit: Number(limit) }]
                }
            },
            { $unwind: "$stage1" },
            {
                $project: {
                    count: "$stage1.count",
                    data: "$stage2"
                }
            }
        ]);

        //console.log('data', data)
        return data
    }

    async get_all_documents_vehicle_sipcop_period(
        workgroup_name: string
    ): Promise<Vehicle[]> {

        // Obtener el periodo activo
        // const period = await this.periodService.getOneActive();

        // IDs de los vehículos del periodo activo
        // const periodVehicleIds = period.vehicles.map(v =>
        //     new Types.ObjectId(v._id)
        // );

        // Filtro por grupo de trabajo
        const query = this.filterOptions({ workgroup_name });

        // Pipeline principal
        const data = await this.vehicleModel.aggregate([
            // joins
            {
                $lookup: {
                    from: 'gps',
                    localField: 'vehicle_device_imei',
                    foreignField: 'gps_device_imei',
                    as: 'vehicle_gps'
                }
            },
            {
                $lookup: {
                    from: 'typeofgps',
                    localField: 'vehicle_gps.typeof_gps_id._id',
                    foreignField: '_id',
                    as: 'vehicle_gps_type'
                }
            },
            // filtros: solo en periodo y del grupo de trabajo
            {
                $match: {
                    $and: [
                        query,
                        // { _id: { $in: periodVehicleIds } },
                        { vehicle_sipcop_tracking: true }
                    ]
                }
            }
        ]);

        return data;
    }


    getPagination = (page: number, limit: number) => {
        const offset: number = page ? page * limit : 0;
        return { limit, offset };
    };

    filterOptions({
        workgroup_name,
        vehicle_available,
        vehicle_trackeable,
        vehicle_state
    }: any): {
        [key: string]: any; // cambiamos a any porque puede ser string o boolean
    } {
        const query: { [key: string]: any } = {};

        if (workgroup_name && workgroup_name !== 'Todos') {
            query.vehicle_workgroup_name = workgroup_name;
        }

        if (vehicle_available && vehicle_available !== 'Todos') {
            // Convertimos string "true"/"false" a booleano
            query.vehicle_available = vehicle_available === 'true';
        }

        if (vehicle_trackeable && vehicle_trackeable !== 'Todos') {
            // Convertimos string "true"/"false" a booleano
            query.vehicle_trackeable = vehicle_trackeable === 'true';
        }
        if (vehicle_state && vehicle_state !== 'Todos') {
            query['vehicle_state.state_name'] = vehicle_state;
        }

        return query;
    }

}