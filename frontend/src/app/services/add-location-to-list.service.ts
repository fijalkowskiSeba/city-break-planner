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

    this.newLocation.next({
      boundingbox: location.boundingbox,
      class: location.class,
      display_name: location.display_name,
      importance: location.importance,
      lat: location.lat,
      licence: location.licence,
      lon: location.lon,
      osm_id: location.osm_id,
      osm_type: location.osm_type,
      place_id: location.place_id,
      powered_by: location.powered_by,
      type: location.type
    });

  }
}
