import { Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  marker = Leaflet.marker([0, 0]);
  constructor() { }

  addMarkerToMap(map: Leaflet.Map,lat :number, lon: number) {
    map.removeLayer(this.marker);
    this.marker = Leaflet.marker([lat, lon]);
    // const marker = Leaflet.marker([lat, lon], {draggable:true});
    map.addLayer(this.marker);
  }
}
