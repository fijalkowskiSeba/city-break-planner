import { Component } from '@angular/core';
import {TripService} from "../../../services/trip.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Trip} from "../../../models/db models/Trip";
import {ErrorModalComponent} from "../../modals/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.css']
})
export class TripHistoryComponent {
  trip?: Trip;
  waitingForData: boolean = true;
  rightColumnDisplay: string = 'photos';


  constructor(private tripService: TripService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router) {}
  ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTripById(id).subscribe({
      next: trip => this.whenTripIsFetched(trip),
      error: error => this.handleFetchError(error)
    })
  }

  private whenTripIsFetched(trip: Trip) {
    this.trip = trip;
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

  onAddPhoto() {

  }

  onAddComment() {

  }

  onAddBill() {

  }

  goBack() {
    this.router.navigate(['/my-trips', this.trip?.id]);
  }
}
