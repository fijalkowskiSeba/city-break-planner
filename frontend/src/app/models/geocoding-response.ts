export interface GeocodingResponse {
  "place_id": number;
  "licence": string;
  "powered_by": string;
  "osm_type": string;
  "osm_id": number;
  "boundingbox": [
    number,
    number,
    number,
    number
  ];
  "lat": number;
  "lon": number;
  "display_name": string;
  "class": string;
  "type": string;
  "importance": number;
}
