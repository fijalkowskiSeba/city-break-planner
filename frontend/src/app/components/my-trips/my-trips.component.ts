import {Component} from '@angular/core';
import {Trip} from "../../models/Trip";
import {TripService} from "../../services/trip.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationModalComponent} from "../modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ])]
})
export class MyTripsComponent {
  allPlannedTrips: Trip[] = [];
  allCompletedTrips: Trip[] = [];

  constructor(private tripService: TripService, private dialog: MatDialog)
  {  }

  ngOnInit() {
    this.tripService.getAllTrips().subscribe((trips) => {
      this.allPlannedTrips = trips.filter(trip => !trip.isCompleted);
      this.allCompletedTrips = trips.filter(trip => trip.isCompleted);
    })
  }

  setAsCompeted(event: Event, plannedTrip: Trip) {
    event.stopPropagation();
    this.tripService.setAsCompleted(plannedTrip.id).subscribe();

    const completedTrip = this.allPlannedTrips.find(trip => trip === plannedTrip);
    if (completedTrip) {
      completedTrip.isCompleted = true;
      this.allPlannedTrips = this.allPlannedTrips.filter(trip => trip !== plannedTrip);
      this.allCompletedTrips.push(completedTrip);
    }
  }

  setAsPlanned(event: Event, completedTrip: Trip) {
    event.stopPropagation();
    this.tripService.setAsPlanned(completedTrip.id).subscribe();

    completedTrip.isCompleted = false;
    this.allCompletedTrips = this.allCompletedTrips.filter(trip => trip !== completedTrip);
    this.allPlannedTrips.push(completedTrip);
  }


  onRemoveClicked(event: Event, trip: Trip) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this trip?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.allPlannedTrips = this.allPlannedTrips.filter(listTrip => listTrip !== trip);
        this.allCompletedTrips = this.allCompletedTrips.filter(listTrip => listTrip !== trip);

        this.tripService.deleteTrip(trip.id).subscribe();
      }
    });
  }
}
