import { Component } from '@angular/core';
import {GeocodingResponse} from "../../../models/geocoding-response";
import {LocationPickingService} from "../../../services/location-picking.service";
import {AddLocationToListService} from "../../../services/add-location-to-list.service";
import {CreateTravelPlanService} from "../../../services/create-travel-plan.service";

@Component({
  selector: 'app-chosen-locations-list',
  templateUrl: './chosen-locations-list.component.html',
  styleUrls: ['./chosen-locations-list.component.css']
})
export class ChosenLocationsListComponent {
  locations: GeocodingResponse[] = [];

  constructor(private locationPickingService: LocationPickingService,
              private addLocationToListService: AddLocationToListService,
              private createTravelPlanService: CreateTravelPlanService) {
  }

  ngOnInit(){
    this.addLocationToListService.newLocationAppeared.subscribe((newLocation) =>
    {
      this.locations.push(newLocation);
    })
  }

  removeLocation(event: Event, location: GeocodingResponse) {
    event.stopPropagation();
    this.locations = this.locations.filter(l => l !== location);
  }

  locationClicked(location: GeocodingResponse) {
    this.locationPickingService.onLocationChanged(location)
  }

  removeAllLocations() {
    this.locations = [];
  }

  createTravelPlan() {
    this.createTravelPlanService.newTrip(this.locations).subscribe();
  }
}
