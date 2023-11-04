import { Component } from '@angular/core';
import {GeocodingAPIService} from "../../../services/geocoding-api.service";
import {GeocodingResponse} from "../../../models/geocoding-response";

@Component({
  selector: 'app-search-place-column',
  templateUrl: './search-place-column.component.html',
  styleUrls: ['./search-place-column.component.css']
})
export class SearchPlaceColumnComponent {
  inputData: string = '';
  serverData: GeocodingResponse[] = [];

  constructor(private geocodingApiService : GeocodingAPIService) {
  }
  fetchData() {
    if(this.inputData.trim() == "" ) return;

    this.geocodingApiService.getLocations(this.inputData).subscribe(data => {
      this.serverData = data;
    });
  }
}
