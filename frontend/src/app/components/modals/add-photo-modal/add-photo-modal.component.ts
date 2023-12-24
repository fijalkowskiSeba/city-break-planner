import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-photo-modal',
  templateUrl: './add-photo-modal.component.html',
  styleUrls: ['./add-photo-modal.component.css']
})
export class AddPhotoModalComponent {

  photoName = '';
  selectedImage?: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddPhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.photoName = data.photoName;
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Adjust the duration as needed
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(
      {
        name: this.photoName,
        photo: this.selectedImage
      });
  }

  isConfirmDisabled() {
    return this.selectedImage === null || this.selectedImage === undefined;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.processImage(file);
  }

  onFileDropped(event: any): void {
    event.preventDefault();

    if (event.dataTransfer.files.length > 0) {
      const file: File = event.dataTransfer.files[0];

      if (file.type.startsWith('image/')) {
        this.processImage(file);
      } else {
        this.showSnackBar('Unsupported file type. Please drop an image file.');
      }
    }
  }


  onDragOver(event: any): void {
    event.preventDefault();
  }

  private processImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
}
