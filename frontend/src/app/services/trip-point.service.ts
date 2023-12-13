import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TripPoint} from "../models/db models/TripPoint";

@Injectable({
  providedIn: 'root'
})
export class TripPointService {

  private apiPath = "/api/tripPoint";

  constructor(
    private http: HttpClient
  ) {
  }

  setVisited(location: TripPoint) {
    const url = this.apiPath + "/setVisited" + "/" + location.id + "/" + location.visited;
    return this.http.patch(url, location);
  }
}
