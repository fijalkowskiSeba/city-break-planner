import {Component} from '@angular/core';
import {Trip} from "../../models/db models/Trip";
import {TripService} from "../../services/trip.service";
import {ActivatedRoute} from "@angular/router";
import {ErrorModalComponent} from "../modals/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {TripPoint} from "../../models/db models/TripPoint";
import {TripPointService} from "../../services/trip-point.service";
import {latLng, tileLayer} from "leaflet";
import "leaflet";
import "leaflet-routing-machine";
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
                private tripPointService: TripPointService) {
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
        this.drawMapRoute();
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

    drawMapRoute() {
        const waypoints = this.trip?.tripPoints.map(point => L.latLng(point.latitude, point.longitude));
        const osrmUrl =  'https://routing.openstreetmap.de/routed-foot/route/v1/';
        L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            show: false,
            draggableWaypoints: false,
            router: L.Routing.osrmv1({
                serviceUrl: osrmUrl,
            }),
        }).addTo(this.map);
    }

}
