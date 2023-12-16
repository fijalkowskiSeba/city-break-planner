import { Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';
import {TripPoint} from "../models/db models/TripPoint";
import "leaflet";
import "leaflet-routing-machine";
// @ts-ignore
declare let L;
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

  addMarkerToMapAndRemoveOthers(map: Leaflet.Map, lat :number, lon: number) {
    map.removeLayer(this.marker);
    this.marker = Leaflet.marker([lat, lon], {draggable:true});
    map.addLayer(this.marker);
  }

  addNotDraggableMarkerToMap(map: Leaflet.Map, lat :number, lon: number) {
    map.removeLayer(this.marker);
    this.marker = Leaflet.marker([lat, lon], {draggable:false});
    map.addLayer(this.marker);
  }

  getCurrentLatLng(){
    return this.marker.getLatLng();
  }

  drawMapRoute(map: any, tripPoints: TripPoint[]) {
    const waypoints = tripPoints.map(point => L.latLng(point.latitude, point.longitude));
    const osrmUrl =  'https://routing.openstreetmap.de/routed-foot/route/v1/';
    L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      show: false,
      draggableWaypoints: false,
      router: L.Routing.osrmv1({
        serviceUrl: osrmUrl,
      }),
    }).addTo(map);
  }

}
