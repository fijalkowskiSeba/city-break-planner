import {Component} from '@angular/core';
import {Trip} from "../../models/Trip";
import {TripService} from "../../services/trip.service";

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.css']
})
export class MyTripsComponent {
  allPlannedTrips: Trip[] = [];
  allCompletedTrips: Trip[] = [];

  constructor(private tripService: TripService) {
  }

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
    // TODO: add confirmation dialog
    this.allPlannedTrips = this.allPlannedTrips.filter(listTrip => listTrip !== trip);
    this.allCompletedTrips = this.allCompletedTrips.filter(listTrip => listTrip !== trip);

    this.tripService.deleteTrip(trip.id).subscribe();
  }
}
