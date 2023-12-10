import {User} from "../user";
import {TripPoint} from "./TripPoint";

export interface Trip {
  id: string;
  name: string;
  isCompleted: Boolean;
  user: User;
  tripPoints: TripPoint[];
}
