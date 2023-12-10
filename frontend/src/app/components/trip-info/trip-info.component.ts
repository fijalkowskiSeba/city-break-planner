import { Component } from '@angular/core';
import {Trip} from "../../models/Trip";
import {TripService} from "../../services/trip.service";
import {ActivatedRoute} from "@angular/router";
import {ErrorModalComponent} from "../modals/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.css']
})
export class TripInfoComponent {
  waitingForData: boolean = true;
  trip?: Trip;
  constructor(private tripService: TripService,
              private route: ActivatedRoute,
              private dialog: MatDialog) { }

  ngOnInit() {
    const id = String( this.route.snapshot.paramMap.get('id'));
    this.tripService.getTripById(id).subscribe({
      next: trip => this.whenTripIsFetched(trip),
      error: error => this.handleFetchError(error)
    })
  }

  private whenTripIsFetched(trip: Trip): void {
    this.trip = trip;
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
}
