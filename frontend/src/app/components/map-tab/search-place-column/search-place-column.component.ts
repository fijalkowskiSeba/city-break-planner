import {Component} from '@angular/core';
import {GeocodingAPIService} from "../../../services/geocoding-api.service";
import {GeocodingResponse} from "../../../models/geocoding-response";
import {LocationPickingService} from "../../../services/location-picking.service";

@Component({
  selector: 'app-search-place-column',
  templateUrl: './search-place-column.component.html',
  styleUrls: ['./search-place-column.component.css']
})
export class SearchPlaceColumnComponent {
  inputData: string = '';
  serverData: GeocodingResponse[] = [];
  selectedLocation: GeocodingResponse | undefined;

  constructor(private geocodingApiService : GeocodingAPIService, private locationPickingService: LocationPickingService) {
  }
  fetchData() {
    if(this.inputData.trim() == "" ) return;

    this.geocodingApiService.getLocations(this.inputData).subscribe(data => {
      this.serverData = data;
    });
  }

  onLocationChange(location: GeocodingResponse | undefined) {
    if(location === undefined){return;}
    this.locationPickingService.onLocationChanged(location);
  }
}
