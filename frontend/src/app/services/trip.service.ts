import {Injectable} from '@angular/core';
import {GeocodingResponse} from "../models/geocoding-response";
import {HttpClient} from "@angular/common/http";
import {TripPointDto} from "../models/trip-point-dto";
import {TripCreationDto} from "../models/trip-creation-dto";
import {Trip} from "../models/Trip";

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiPath = "/api/trip";

  constructor(
    private http: HttpClient
  ) {
  }

  newTrip(locations: GeocodingResponse[], tripName: string,
          firstLocation: GeocodingResponse | undefined, lastLocation: GeocodingResponse | undefined) {
    const url = this.apiPath + "/new"

    if (firstLocation === lastLocation) {
      locations.push(
        {
          lat: lastLocation!.lat,
          lon: lastLocation!.lon,
          display_name: lastLocation!.display_name
        }
      )
    }

    const locationList: TripPointDto[] = locations.map((location, index) => ({
      name: location.display_name,
      latitude: location.lat,
      longitude: location.lon,
      orderInTrip: location === firstLocation ? -1 : location === lastLocation ? -2 : 0
    }));

    const bodyToSend: TripCreationDto = {
      tripName: tripName,
      locations: locationList
    }

    return this.http.post<TripCreationDto>(url, bodyToSend)
  }

  getAllTrips() {
    return this.http.get<Trip[]>(this.apiPath + "/all");
  }

  getTripById(tripId: string) {
    return this.http.get<Trip>(this.apiPath + "/" + tripId);
  }

  setAsCompleted(id: string) {
    return this.http.patch(this.apiPath + "/" + id + "/setCompleted", null);
  }

  setAsPlanned(id: string) {
    return this.http.patch(this.apiPath + "/" + id + "/setPlanned", null);
  }

  deleteTrip(id: string) {
    return this.http.delete(this.apiPath + "/" + id);
  }
}
