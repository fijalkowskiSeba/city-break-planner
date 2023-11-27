import { Injectable } from '@angular/core';
import {GeocodingResponse} from "../models/geocoding-response";
import {HttpClient} from "@angular/common/http";
import {TripPointDto} from "../models/trip-point-dto";

@Injectable({
  providedIn: 'root'
})
export class CreateTravelPlanService {

  private apiPath = "/api/trip";

  constructor(
    private http: HttpClient
  ) { }

  newTrip(locations: GeocodingResponse[]) {
    const url = this.apiPath +  "/new"

    var bodyToSend: TripPointDto[] = locations.map((location,index) => ({
      id: "",
      name: location.display_name,
      latitude: location.lat,
      longitude: location.lon,
      orderInTrip: 0
    }));

    return this.http.post<TripPointDto[]>(url,bodyToSend)
  }
}
