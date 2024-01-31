import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-bill-modal',
  templateUrl: './add-bill-modal.component.html',
  styleUrls: ['./add-bill-modal.component.css']
})
export class AddBillModalComponent {

  billForm = {
    name: '',
    price: 0,
    currency: ''
  }

  maxPrice = 999999999;

  constructor(
    public dialogRef: MatDialogRef<AddBillModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.billForm = data.billForm;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.billForm);
  }

  isConfirmDisabled() {
    return this.billForm.name === '' || this.billForm.price < 0 || this.billForm.price > this.maxPrice;
  }
}
