import {TripPhoto} from "./TripPhoto";
import {TripComment} from "./TripComment";
import {TripBill} from "./TripBill";

export interface TripPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  orderInTrip: number;
  tripBills: TripBill[];
  tripPhotos: TripPhoto[];
  tripComments: TripComment[];
}
