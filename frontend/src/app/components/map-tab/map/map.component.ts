import {AfterViewInit, Component} from '@angular/core';
import * as Leaflet from 'leaflet';
import {LocationPickingService} from "../../../services/location-picking.service";
import {MarkerService} from "../../../services/marker.service";
import {GeocodingResponse} from "../../../models/geocoding-response";
import {AddLocationToListService} from "../../../services/add-location-to-list.service";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit{
  private map: any ;
  addChosenLocationButtonVisible = false;
  currentLocation: GeocodingResponse | undefined;

  constructor(private locationPickingService: LocationPickingService, private markerService: MarkerService,
              private addLocationToListService: AddLocationToListService) {
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [ 50.2045, 19.0118 ],
      zoom: 10
    });
    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  ngAfterViewInit(){
    this.initMap();
    this.locationPickingService.locationChanged$.subscribe((newLocation) => {
      this.currentLocation = newLocation;
      this.showLocation(newLocation.lat,newLocation.lon);
      this.addChosenLocationButtonVisible = true;
    });
  }

  private showLocation(latitude: number, longitude: number){
    this.map.setView([latitude,longitude],15);
    this.markerService.addMarkerToMap(this.map,latitude,longitude);
  }

  addChosenLocation() {
    const lat = this.markerService.getCurrentLatLng().lat;
    const lng = this.markerService.getCurrentLatLng().lng;
    if (this.currentLocation != undefined) {
      this.addLocationToListService.addLocation(this.currentLocation, lat, lng);
    }
  }

}
