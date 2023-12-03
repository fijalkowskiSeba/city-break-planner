import {Component} from '@angular/core';
import {GeocodingResponse} from "../../../models/geocoding-response";
import {LocationPickingService} from "../../../services/location-picking.service";
import {AddLocationToListService} from "../../../services/add-location-to-list.service";
import {CreateTravelPlanService} from "../../../services/create-travel-plan.service";
import {MatDialog} from "@angular/material/dialog";
import {AskForNameModalComponent} from "./ask-for-name-modal/ask-for-name-modal.component";

@Component({
  selector: 'app-chosen-locations-list',
  templateUrl: './chosen-locations-list.component.html',
  styleUrls: ['./chosen-locations-list.component.css']
})
export class ChosenLocationsListComponent {
  locations: GeocodingResponse[] = [];
  firstLocation?: GeocodingResponse;
  lastLocation?: GeocodingResponse;
  tripName = "";

  constructor(private locationPickingService: LocationPickingService,
              private addLocationToListService: AddLocationToListService,
              private createTravelPlanService: CreateTravelPlanService,
              private matDialog: MatDialog) {
  }

  ngOnInit() {
    this.addLocationToListService.newLocationAppeared.subscribe((newLocation) => {
      this.locations.push(newLocation);
    })
  }

  removeLocation(event: Event, location: GeocodingResponse) {
    event.stopPropagation();
    this.locations = this.locations.filter(l => l !== location);
    if (this.firstLocation === location) {
      this.firstLocation = undefined;
    }
    if (this.lastLocation === location) {
      this.lastLocation = undefined;
    }
  }

  locationClicked(location: GeocodingResponse) {
    this.locationPickingService.onLocationChanged(location)
  }

  removeAllLocations() {
    this.locations = [];
    this.firstLocation = undefined;
    this.lastLocation = undefined;
  }

  askForTripName() {
    const dialogRef = this.matDialog.open(AskForNameModalComponent, {
      data: {tripName: this.tripName}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tripName = result;
        this.createTravelPlanService
          .newTrip(this.locations, this.tripName, this.firstLocation, this.lastLocation)
          .subscribe();
      }
    });
  }

  setFirstLocation(location: GeocodingResponse) {
    this.firstLocation === location ? this.firstLocation = undefined : this.firstLocation = location;
  }

  setLastLocation(location: GeocodingResponse) {
    this.lastLocation === location ? this.lastLocation = undefined : this.lastLocation = location;
  }
}
