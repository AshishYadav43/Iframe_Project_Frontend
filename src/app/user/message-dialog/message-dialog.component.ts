import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.css'
})
export class MessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string, name: string ,data:any}
  ) {

  }

  ngOnInit() {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

onCancel(): void {
  this.dialogRef.close(false);
}


  getDisplayName(): string {
  if (this.data.name == 'Country') {
    return this.data?.data?.countryName || '';
  } else if (this.data.name == 'Currency') {
    return this.data?.data?.name || '';
  } else if (this.data.name == 'Company') {
    return this.data?.data?.name || '';
  }
  return '';
}

}
