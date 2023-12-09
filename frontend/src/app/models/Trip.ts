import {User} from "./user";

export interface Trip {
  id: string;
  name: string;
  isCompleted: Boolean;
  user: User;
}
