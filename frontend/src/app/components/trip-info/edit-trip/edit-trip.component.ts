import { Component } from '@angular/core';
import {Trip} from "../../../models/db models/Trip";
import {TripService} from "../../../services/trip.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../modals/error-modal/error-modal.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {TripPoint} from "../../../models/db models/TripPoint";

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent {
  waitingForData: boolean = true;
  trip?: Trip;
  private originalTrip?: Trip;

  constructor(private tripService: TripService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router){}

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
}
