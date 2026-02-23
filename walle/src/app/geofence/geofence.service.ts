import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Geofence, GeofenceDocument } from "./schema/geofence.schema";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ROBIN_SERVER_DB_NAME } from "src/common/constants/database.constant";

@Injectable()
export class GeofenceService {
    private dirname: string;
    constructor(
        @InjectModel(Geofence.name, ROBIN_SERVER_DB_NAME)
        private readonly geofenceModel: Model<GeofenceDocument>,
        private eventEmitter: EventEmitter2,
    ) {
        this.dirname = "./src/common/assets/geofence/";
    }

    /**
     * Retrieves all geofence documents
     * @returns Promise<unknown[]> - Array of geofence documents
     */
    async getDocuments(): Promise<unknown[]> {
        return await this.geofenceModel.find();
    }

    /**
     * Retrieves a single geofence document by ID
     * @param id - The ID of the geofence document
     * @returns Promise<GeofenceDocument> - The found geofence document or null
     */
    async getOneById(id: string): Promise<GeofenceDocument | null> {
        return await this.geofenceModel.findById(id);
    }

    /**
     * Verifies if a given point (latitude, longitude) is inside any geofence
     * @param lat - The latitude coordinate
     * @param lng - The longitude coordinate
     * @returns Promise<boolean> - Returns true if point is inside a geofence, false otherwise
     */
    async verifyIfPointIsInside(lat: number, lng: number): Promise<boolean> {
        const geofence = await this.geofenceModel.findOne({
            "geometry.coordinates": { $ne: [] },
            geometry: {
                $geoIntersects: {
                    $geometry: { type: 'Point', coordinates: [lat, lng] }
                }
            }
        }).lean();
        return !!geofence;
    }

    //** SECTORS */
    async getSectordocumentByCoordinates(longitude: number, latitude: number): Promise<unknown> {
        const documents = await this.geofenceModel.aggregate([
            {
                $match: {
                    $and: [
                        { geometry: { $exists: true } },
                        { "geometry.coordinates": { $ne: [] } },
                        { sectoring: { $ne: [] } }
                    ]
                }
            },
            { $unwind: "$sectoring" },
            {
                $match: {
                    "sectoring.geometry": {
                        $geoIntersects: { $geometry: { type: 'Point', coordinates: [latitude, longitude] } }
                    }
                }
            },
            {
                $project: {
                    id: 1,
                    "sectoring._id": 1,
                    "sectoring.sector_name": 1,
                    "sectoring.sector_description": 1
                }
            },
            { $limit: 1 }
        ]);
        if (documents.length > 0) {
            return documents[0];
        } else {
            return null;
        }
    };

    async getOneDocument() {
        return await this.geofenceModel.findOne({
            $and: [
                { geometry: { $exists: true } },
                { "geometry.coordinates": { $ne: [] } },
                { sectoring: { $ne: [] } }
            ]
        });
    }
}