import { Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;

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
