import {Component} from '@angular/core';
import {Trip} from "../../../models/db models/Trip";
import {TripService} from "../../../services/trip.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../modals/error-modal/error-modal.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {TripPoint} from "../../../models/db models/TripPoint";
import {EditTripPointModalComponent} from "../../modals/edit-trip-point-modal/edit-trip-point-modal.component";
import {latLng, tileLayer} from "leaflet";
import {MarkerService} from "../../../services/marker.service";
import {GeocodingAPIService} from "../../../services/geocoding-api.service";
import {GeocodingResponse} from "../../../models/geocoding-response";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent{
  waitingForData: boolean = true;
  trip?: Trip;
  private originalTrip?: Trip;
  newPlaceInput: string = '';

  constructor(private tripService: TripService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private markerService: MarkerService,
              private geocodingApiService: GeocodingAPIService){}

  ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTripById(id).subscribe({
      next: trip => this.whenTripIsFetched(trip),
      error: error => this.handleFetchError(error)
    })
  }

  private whenTripIsFetched(trip: Trip) {
    this.trip = JSON.parse(JSON.stringify(trip));
    if(this.trip === undefined) {
      this.openErrorModal("Trip not found");
      return;
    }
    this.originalTrip = trip;
    this.trip.tripPoints.sort((a, b) => a.orderInTrip - b.orderInTrip);
    this.waitingForData = false;
  }

  private handleFetchError(error: any) {
    if (error.status === 404) {
      this.openErrorModal(error.error);
    } else {
      console.error('Error:', error);
    }
  }

  openErrorModal(errorMessage: string): void {
    console.log(errorMessage);

    this.dialog.open(ErrorModalComponent, {
      width: '400px',
      data: {
        title: 'Error',
        message: errorMessage,
        redirectPath: '/my-trips',
        buttonLabel: 'Go back to my trips'
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if(this.trip?.tripPoints === undefined) return;
    moveItemInArray(this.trip?.tripPoints, event.previousIndex, event.currentIndex);
  }

  onLocationEdit(location: TripPoint) {
    const dialogRef = this.dialog.open(EditTripPointModalComponent, {
      width: '400px',
      data: {
        title: 'Edit Trip Point',
        location: location
      }
    });

    dialogRef.afterClosed().subscribe((result: TripPoint) => {
      if (result) {
        location.name = result.name;
      } else {
        console.log('Editing canceled');
      }
    });
  }

  onLocationRemove(location: TripPoint) {
    this.trip?.tripPoints?.splice(this.trip.tripPoints.indexOf(location), 1);
    this.markerService.drawMapRoute(this.map, this.trip!.tripPoints);
  }

  onSaveChanges() {
    if(this.trip === undefined || this.originalTrip === undefined) return;
    this.tripService.updateTrip(this.trip).subscribe({
      next: () => this.onCancel(),
      error: error => this.openErrorModal(error.error.error)
    });
  }

  onCancel() {
    this.router.navigate(['/my-trips', this.trip?.id]);
  }

  private map: any ;

  options = {
    layers: [
      tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      })
    ],
    zoom: 15,
    center: latLng(0, 0),
    draggable: false
  };

  onMapReady(map: L.Map) {
    this.map = map;
    if (this.trip?.tripPoints[0]){
      this.markerService.drawMapRoute(this.map, this.trip.tripPoints);
    }
  }

  private showLocation(latitude: number, longitude: number){
    this.map.setView([latitude,longitude],15);
    this.markerService.addNotDraggableMarkerToMap(this.map,latitude,longitude);
  }

  onLocationClicked(location: TripPoint) {
    this.map.setView([location.latitude,location.longitude],15);
  }

    fetchPointsFromApi() {
        this.geocodingApiService.getLocations(this.newPlaceInput).subscribe({
            next: locations => this.onLocationsFetched(locations)
        });
    }

    fetchedLocations: TripPoint[] = [];
    private onLocationsFetched(locations: GeocodingResponse[]) {
        if(locations.length === 0) {return;}
        this.fetchedLocations = [];
        locations.map(location => {
            const newTripPoint = {
                name: location.display_name,
                latitude: location.lat,
                longitude: location.lon
            } as TripPoint;
            this.fetchedLocations.push(newTripPoint);
        })
    }

    newLocation: TripPoint | undefined;
    onOptionSelected(event: MatAutocompleteSelectedEvent) {
        const selectedLocation = event.option.value as TripPoint;
        this.markerService.addMarkerToMapAndRemoveOthers(this.map, selectedLocation.latitude, selectedLocation.longitude);
        this.showLocation(selectedLocation.latitude, selectedLocation.longitude);
        this.newLocation = selectedLocation;
    }

    displayLocationName(location: any): string {
        return location ? location.name : '';
    }

    onClearMap() {
        this.newLocation = undefined;
        this.markerService.removeMarkerFromMap(this.map);
    }

    onAddLocation() {
        let newLocation =
            {
                name: this.newLocation?.name,
                latitude: this.newLocation?.latitude,
                longitude: this.newLocation?.longitude,
                orderInTrip: this.trip?.tripPoints.length
            } as TripPoint;

        this.trip?.tripPoints.push(newLocation);
        this.markerService.removeMarkerFromMap(this.map);
        this.markerService.drawMapRoute(this.map, this.trip!.tripPoints);

        this.newLocation = undefined;
        this.newPlaceInput = '';
        this.fetchedLocations = [];
    }
}
