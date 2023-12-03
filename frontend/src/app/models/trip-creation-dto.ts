import {TripPointDto} from "./trip-point-dto";

export interface TripCreationDto{
  tripName: string;
  locations: TripPointDto[];
}
