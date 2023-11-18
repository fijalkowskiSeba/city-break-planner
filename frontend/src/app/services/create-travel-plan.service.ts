import { Injectable } from '@angular/core';
import {GeocodingResponse} from "../models/geocoding-response";

@Injectable({
  providedIn: 'root'
})
export class CreateTravelPlanService {

  constructor() { }

  newTrip(locations: GeocodingResponse[]) {
    return null; // TODO implementation
  }
}
