import {Component} from '@angular/core';
import {Trip} from "../../models/db models/Trip";
import {TripService} from "../../services/trip.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorModalComponent} from "../modals/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {TripPoint} from "../../models/db models/TripPoint";
import {TripPointService} from "../../services/trip-point.service";
import {latLng, tileLayer} from "leaflet";
import "leaflet";
import "leaflet-routing-machine";
import {MarkerService} from "../../services/marker.service";
// @ts-ignore
declare let L;

@Component({
    selector: 'app-trip-info',
    templateUrl: './trip-info.component.html',
    styleUrls: ['./trip-info.component.css']
})
export class TripInfoComponent {
    waitingForData: boolean = true;
    trip?: Trip;
    private map: any;

    options = {
        layers: [
            tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors"
            })
        ],
        zoom: 1,
        center: latLng(46.879966, -121.726909)
    };

    constructor(private tripService: TripService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private tripPointService: TripPointService,
                private router: Router,
                private makerService: MarkerService) {
    }

    ngOnInit() {
        const id = String(this.route.snapshot.paramMap.get('id'));
        this.tripService.getTripById(id).subscribe({
            next: trip => this.whenTripIsFetched(trip),
            error: error => this.handleFetchError(error)
        })
    }

    private whenTripIsFetched(trip: Trip): void {
        this.trip = trip;
        this.trip.tripPoints.sort((a, b) => a.orderInTrip - b.orderInTrip);
        this.waitingForData = false;
        this.makerService.drawMapRoute(this.map, this.trip.tripPoints);
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

    onMapReady(map: L.Map) {
        this.map = map;
    }

    onTripHistoryClick() {
        if(!this.trip?.id) return;
        this.router.navigate(['/my-trips', this.trip.id, 'history']);
    }

    onEditTripClick() {
        if(!this.trip?.id) return;
        this.router.navigate(['/my-trips', this.trip.id, 'edit']);
    }
}
