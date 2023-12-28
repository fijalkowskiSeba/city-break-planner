import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GeocodingResponse} from "../models/geocoding-response";

@Injectable({
  providedIn: 'root'
})
export class GeocodingAPIService {
  private forwardGeocodeURL = "https://geocode.maps.co/search?q="; //example = https://geocode.maps.co/search?q={address}
  private reverseGeocodeURL = "https://geocode.maps.co/reverse?"; //example = https://geocode.maps.co/reverse?lat={latitude}&lon={longitude}
  private apiKey = "&api_key=658d3f9cc5a70828440234jdh052adf";
  constructor(private http: HttpClient) { }

  getLocations(locationName: string) :Observable<GeocodingResponse[]> {
    const query = locationName.replace(/\s+/g, '+');
    return this.http.get<GeocodingResponse[]>(this.forwardGeocodeURL + "{" + query + "}" + this.apiKey)
  }

  getLocationByLatLon(lat:number, lon: number): Observable<GeocodingResponse>{
    const requestURL = this.reverseGeocodeURL + "lat=" + lat + "&lon=" + lon + "" + this.apiKey;
    return this.http.get<GeocodingResponse>(requestURL);
  }

}
