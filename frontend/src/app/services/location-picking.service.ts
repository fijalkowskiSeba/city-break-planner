import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {GeocodingResponse} from "../models/geocoding-response";

@Injectable({
  providedIn: 'root'
})
export class LocationPickingService {
  locationChangedSource = new Subject<GeocodingResponse>();
  locationChanged$ = this.locationChangedSource.asObservable();
  constructor() { }

  onLocationChanged(location: GeocodingResponse) {
    this.locationChangedSource.next(location);
  }
}
