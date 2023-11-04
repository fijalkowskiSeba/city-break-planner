import {AfterViewInit, Component} from '@angular/core';
import * as Leaflet from 'leaflet';
import {LocationPickingService} from "../../services/location-picking.service";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit{
  private map: any ;

  constructor(private locationPickingService: LocationPickingService) {
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
      console.log("MAP subscription");
      this.showLocation(newLocation.lat,newLocation.lon);
    });
  }

  private showLocation(latitude: number, longitude: number){
    this.map.setView([latitude,longitude],10);
  }

}
