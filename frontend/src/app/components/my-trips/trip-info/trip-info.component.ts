import { Component } from '@angular/core';
import {Trip} from "../../../models/Trip";
import {TripService} from "../../../services/trip.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.css']
})
export class TripInfoComponent {
  waitingForData: boolean = true;
  trip?: Trip;
  constructor(private tripService: TripService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = String( this.route.snapshot.paramMap.get('id'));
    this.tripService.getTripById(id).subscribe((trip) => {
      this.trip = trip;
      this.waitingForData = false;
    });
  }
}
