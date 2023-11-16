import { Injectable } from '@angular/core';
import {GeocodingResponse} from "../models/geocoding-response";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AddLocationToListService {
  newLocation = new Subject<GeocodingResponse>();
  newLocationAppeared = this.newLocation.asObservable()
  constructor() { }

  addLocation(location: GeocodingResponse , lat: number, lng: number) {
    location.lat = lat;
    location.lon = lng;
    this.newLocation.next(location);
  }
}
