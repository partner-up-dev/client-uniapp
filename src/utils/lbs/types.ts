// Utils/LBS's types

// types

export enum QQMapDirectionMode {
    Driving = "driving",
    Walking = "walking",
    Bicycling = "bicycling",
    Transit = "transit"
}

export interface QQMapDirectionDrivingRoute {
    distance: number;
    duration: number;
    polyline: number[];
    waypoints: {
        title: string;
        location: {
            lat: number;
            lng: number;
        };
    }[];
    taxi_fare?: {
        fare: number;
    };
    steps: {
        instruction: string;
        polyline_idx: number[];
        road_name?: string;
        dir_desc?: string;
        distance: number;
        act_desc?: string;
        accessorial_desc?: string;
    }
}

export type QQMapRouteUnion<T extends QQMapDirectionMode> = T extends QQMapDirectionMode.Driving ? QQMapDirectionDrivingRoute : never;

export type QQMapDirectionResult<T extends QQMapDirectionMode> = {
    status: number;
    message: string;
    result: {
        routes: QQMapRouteUnion<T>[];
    }
}