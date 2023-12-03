import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-ask-for-name-modal',
  templateUrl: './ask-for-name-modal.component.html',
  styleUrls: ['./ask-for-name-modal.component.css']
})
export class AskForNameModalComponent {
  inputData: string = '';

  constructor(
    public dialogRef: MatDialogRef<AskForNameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tripName: string }
  ) {
    this.inputData = data.tripName;
  }

  onCreateClick() {
    this.dialogRef.close(this.inputData);
  }
}
