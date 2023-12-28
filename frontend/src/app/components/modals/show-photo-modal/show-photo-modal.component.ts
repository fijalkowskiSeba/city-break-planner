import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-show-photo-modal',
  templateUrl: './show-photo-modal.component.html',
  styleUrls: ['./show-photo-modal.component.css']
})
export class ShowPhotoModalComponent {

  photoName = '';
    constructor(
      public dialogRef: MatDialogRef<ShowPhotoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.photoName = data.photo.name;
  }

  isConfirmDisabled() {
    return this.photoName == '';
  }

  onSave() {
    this.dialogRef.close({
      name: this.photoName
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  getPhoto() {
    const photo = this.data.photoFile;
    if(photo === undefined) return;
    return "data:image/" + photo!.fileExtension + ";base64," + photo!.base64String;
  }

  onDelete() {
    this.dialogRef.close('delete');
  }
}
