import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GeocodingResponse} from "../models/geocoding-response";

@Injectable({
  providedIn: 'root'
})
export class GeocodingAPIService {
  private geocodingURL = "https://geocode.maps.co/search?q="; //example = https://geocode.maps.co/search?q={address}
  constructor(private http: HttpClient) { }

  getLocations(locationName: string) :Observable<GeocodingResponse[]> {
    let query = locationName.replace(/\W+/g, '+');
    return this.http.get<GeocodingResponse[]>(this.geocodingURL + "{" + query + "}")
  }

}
