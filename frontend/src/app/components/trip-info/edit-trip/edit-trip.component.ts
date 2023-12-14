import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {Trip} from "../../../models/db models/Trip";
import {TripService} from "../../../services/trip.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../modals/error-modal/error-modal.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {TripPoint} from "../../../models/db models/TripPoint";
import {EditTripPointModalComponent} from "../../modals/edit-trip-point-modal/edit-trip-point-modal.component";
import * as Leaflet from "leaflet";
import {latLng, tileLayer} from "leaflet";
import {MarkerService} from "../../../services/marker.service";

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent{
  waitingForData: boolean = true;
  trip?: Trip;
  private originalTrip?: Trip;

  constructor(private tripService: TripService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private markerService: MarkerService){}

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
        this.showLocation(this.trip.tripPoints[0].latitude,this.trip.tripPoints[0].longitude);
    }
  }

  private showLocation(latitude: number, longitude: number){
    this.map.setView([latitude,longitude],15);
    this.markerService.addNotDraggableMarkerToMap(this.map,latitude,longitude);
  }

  onLocationClicked(location: TripPoint) {
    this.showLocation(location.latitude,location.longitude);
  }
}
