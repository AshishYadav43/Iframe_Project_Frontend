import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { ToastrService } from 'ngx-toastr';

import { finalize } from 'rxjs';

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
  isLoading: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: AuthService,
    private toaster: ToastrService
  ) {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.data.type == "country") this.deleteCountry();
    this.dialogRef.close(true);
  }

  deleteCountry() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.api.updateCountry({ _id: this.data._id, updatedData: { isDeleted: true } }).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (res: any) => {
        this.toaster.success("Country deleted successfully");
      }
    })
  }
}
