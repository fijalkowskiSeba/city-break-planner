import {Component} from '@angular/core';
import {Trip} from "../../models/db models/Trip";
import {TripService} from "../../services/trip.service";
import {ActivatedRoute} from "@angular/router";
import {ErrorModalComponent} from "../modals/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import * as Leaflet from "leaflet";
import {TripPoint} from "../../models/db models/TripPoint";
import {MarkerService} from "../../services/marker.service";
import {TripPointService} from "../../services/trip-point.service";

@Component({
  selector: 'app-trip-info',
  templateUrl: './trip-info.component.html',
  styleUrls: ['./trip-info.component.css']
})
export class TripInfoComponent{
  waitingForData: boolean = true;
  trip?: Trip;
  private map: any ;

  constructor(private tripService: TripService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private markerService: MarkerService,
              private tripPointService: TripPointService) { }

  ngOnInit() {
    const id = String( this.route.snapshot.paramMap.get('id'));
    this.tripService.getTripById(id).subscribe({
      next: trip => this.whenTripIsFetched(trip),
      error: error => this.handleFetchError(error)
    })
  }

  private initMap(): void {
    if(this.trip?.tripPoints[0]){
      const firstPoint = this.trip.tripPoints[0];
      this.map = Leaflet.map('info-map', {
        center: [ firstPoint.latitude, firstPoint.longitude ],
        zoom: 15
      });
      for (let point of this.trip.tripPoints) {
        this.markerService.addMarkerToMap(this.map, point.latitude, point.longitude)
      }
    }else{
      this.map = Leaflet.map('info-map', {
        center: [ 50.2045, 19.0118 ],
        zoom: 15
      });
    }
    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private whenTripIsFetched(trip: Trip): void {
    this.trip = trip;
    this.trip.tripPoints.sort((a, b) => a.orderInTrip - b.orderInTrip);
    this.waitingForData = false;
    this.initMap();
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

  locationClicked(event: Event, location: TripPoint) {
    this.map.setView([location.latitude,location.longitude],15);
  }

  checkboxClicked(location: TripPoint) {
    this.tripPointService.setVisited(location).subscribe();
  }
}
