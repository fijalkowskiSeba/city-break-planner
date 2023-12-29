import {Injectable} from '@angular/core';
import {GeocodingResponse} from "../models/geocoding-response";
import {HttpClient} from "@angular/common/http";
import {TripPointDto} from "../models/trip-point-dto";
import {TripCreationDto} from "../models/trip-creation-dto";
import {Trip} from "../models/db models/Trip";
import {TripPoint} from "../models/db models/TripPoint";
import {AutoRouteBody} from "../models/auto-route-body";
import {PhotoFileDto} from "../models/photo-file-dto";

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

    if (firstLocation && lastLocation && firstLocation === lastLocation) {
      locations.push(firstLocation)
    }

    // -1 is first location, -2 is last location, 0 is every other location
    var firstLocationAdded = firstLocation === undefined;
    const locationList: TripPointDto[] = locations.map((location, index) => ({
      name: location.display_name,
      latitude: location.lat,
      longitude: location.lon,
      orderInTrip: location === firstLocation ?
        (firstLocationAdded ? -2 : (firstLocationAdded = true, -1)) :
        (location === lastLocation ? -2 : 0)
    }));

    const bodyToSend: TripCreationDto = {
      tripName: tripName,
      locations: locationList
    }

    return this.http.post<Trip>(url, bodyToSend)
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

  updateTrip(trip: Trip) {
    return this.http.put(this.apiPath + "/" + trip.id, trip);
  }

  autoRoute(tripPoints: TripPoint[], firstLocation: TripPoint | undefined, lastLocation: TripPoint | undefined) {

    const url = this.apiPath + "/autoRoute";
    const bodyToSend = {
      tripPoints: tripPoints,
      firstLocation: firstLocation,
      lastLocation: lastLocation
    } as AutoRouteBody;

    return this.http.post<TripPoint[]>(url, bodyToSend);
  }

  getTripPhotos(tripId: string) {
    return this.http.get<PhotoFileDto[]>(this.apiPath + "/allPhotos/" + tripId);
  }
}
