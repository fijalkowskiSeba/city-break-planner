import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-photo-modal',
  templateUrl: './add-photo-modal.component.html',
  styleUrls: ['./add-photo-modal.component.css']
})
export class AddPhotoModalComponent {

  name = '';
  photo?: string | ArrayBuffer | null = null;
  file?: File;

  constructor(
    public dialogRef: MatDialogRef<AddPhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.name = data.photoName;
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
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
        name: this.name,
        file: this.file
      });
  }

  isConfirmDisabled() {
    return this.photo === null || this.photo === undefined;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.validateAndProcessFile(file);
  }

  onFileDropped(event: any): void {
    event.preventDefault();

    if (event.dataTransfer.files.length > 0) {
      const file: File = event.dataTransfer.files[0];
      this.validateAndProcessFile(file);
    }
  }

  private validateAndProcessFile(file: File): void {
    if (file) {
      if (file.type.startsWith('image/')) {
        if (this.isFileSizeValid(file.size)) {
          this.processImage(file);
        } else {
          this.showSnackBar('File size exceeds the maximum allowed size (10MB).');
        }
      } else {
        this.showSnackBar('Unsupported file type. Please choose an image file.');
      }
    }
  }

  private isFileSizeValid(fileSize: number = 0): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    return fileSize <= maxSize;
  }

  onDragOver(event: any): void {
    event.preventDefault();
  }

  private processImage(file: File): void {
    this.file = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.photo = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
}
