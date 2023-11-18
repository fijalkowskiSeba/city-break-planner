import { Injectable } from '@angular/core';
import {GeocodingResponse} from "../models/geocoding-response";
import {Subject} from "rxjs";
import {GeocodingAPIService} from "./geocoding-api.service";

@Injectable({
  providedIn: 'root'
})
export class AddLocationToListService {
  newLocation = new Subject<GeocodingResponse>();
  newLocationAppeared = this.newLocation.asObservable()
  constructor(private geocodingAPIService: GeocodingAPIService) { }

  addLocation(location: GeocodingResponse , lat: number, lng: number) {
    if(location.lat == lat && location.lon == lng){
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
    }else {
      this.geocodingAPIService.getLocationByLatLon(lat,lng).subscribe((l) => {
        this.newLocation.next({
          boundingbox: l.boundingbox,
          class: l.class,
          display_name: l.display_name,
          importance: l.importance,
          lat: l.lat,
          licence: l.licence,
          lon: l.lon,
          osm_id: l.osm_id,
          osm_type: l.osm_type,
          place_id: l.place_id,
          powered_by: l.powered_by,
          type: l.type
        });
      })
    }




  }
}
