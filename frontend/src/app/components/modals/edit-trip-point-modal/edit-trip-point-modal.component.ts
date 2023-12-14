import {Component, Inject} from '@angular/core';
import {TripPoint} from "../../../models/db models/TripPoint";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-trip-point-modal',
  templateUrl: './edit-trip-point-modal.component.html',
  styleUrls: ['./edit-trip-point-modal.component.css']
})
export class EditTripPointModalComponent {
  title: string;
  editedLocation: TripPoint;

  constructor(
      public dialogRef: MatDialogRef<EditTripPointModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { title: string, location: TripPoint }
  ) {
    this.title = data.title || 'Edit Location';
    this.editedLocation = { ...data.location };
  }

  onSave(): void {
    this.dialogRef.close(this.editedLocation);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
