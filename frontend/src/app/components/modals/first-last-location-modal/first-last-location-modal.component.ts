import {Component, Inject} from '@angular/core';
import {TripPoint} from "../../../models/db models/TripPoint";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-first-last-location-modal',
  templateUrl: './first-last-location-modal.component.html',
  styleUrls: ['./first-last-location-modal.component.css']
})
export class FirstLastLocationModalComponent {
  locations: TripPoint[] = [];
  selectedLocation1: TripPoint | undefined;
  selectedLocation2: TripPoint | undefined;

  constructor(
      public dialogRef: MatDialogRef<FirstLastLocationModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { locations: TripPoint[] }
  ) {}

  ngOnInit(): void {
    this.locations = this.data.locations;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onRouteSelected(): void {
    this.dialogRef.close({
      location1: this.selectedLocation1,
      location2: this.selectedLocation2,
    });
  }
}
