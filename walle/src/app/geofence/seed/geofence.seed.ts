import { GeofenceD } from "../dto/geofence.dto";

export const defaultData = (): Partial<GeofenceD> => {
    return {
        template: "template-excel-coordenadas.xlsx"
    }
}