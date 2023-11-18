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
        display_name: location.display_name,
        lat: location.lat,
        lon: location.lon,
      });
    }else {
      this.geocodingAPIService.getLocationByLatLon(lat,lng).subscribe((l) => {
        this.newLocation.next({
          display_name: l.display_name,
          lat: l.lat,
          lon: l.lon,
        });
      })
    }




  }
}
