import { Component } from '@angular/core';
import {Trip} from "../../models/Trip";
import {TripService} from "../../services/trip.service";

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.css']
})
export class MyTripsComponent {
  allTrips: Trip[] = [];

  constructor(private tripService: TripService) {
  }

  ngOnInit() {
    this.tripService.getAllTrips().subscribe((trips) => {
      this.allTrips = trips;
    })
  }
}
