import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent {

  commentForm = {
    title: '',
    content: ''
  }

  constructor(
    public dialogRef: MatDialogRef<CommentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.commentForm = data.commentForm;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.commentForm);
  }

  isConfirmDisabled() {
    return this.commentForm.title === '' || this.commentForm.content === ''
  }
}
