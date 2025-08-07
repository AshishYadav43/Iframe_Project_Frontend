import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-delete-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatIcon
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: AuthService,
    private toaster: ToastrService
  ) {
    console.log("DATA", data);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.data.type == "country") this.deleteCountry();
    this.dialogRef.close(true);
  }

  deleteCountry() {
    this.api.updateCountry({ _id: this.data._id, updatedData: { isDeleted: true } }).subscribe({
      next: (res: any) => {
        console.log("RESPONSE", res);
        this.toaster.success("Country deleted successfully");
      }
    })
  }
}
