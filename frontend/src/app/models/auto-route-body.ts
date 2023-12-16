import {TripPoint} from "./db models/TripPoint";

export interface AutoRouteBody {
    tripPoints: TripPoint[],
    firstLocation: TripPoint,
    lastLocation: TripPoint
}
