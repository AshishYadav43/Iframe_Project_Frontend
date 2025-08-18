import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-qr-display',
  imports: [
    CommonModule,
    MatCard,
    MatIcon
  ],
  templateUrl: './qr-display.component.html',
  styleUrl: './qr-display.component.css'
})
export class QrDisplayComponent {

  loading = true;
  qrCode = '';
  email = '';
  issuer = '';
  private api = inject(AuthService);

  constructor(
    private dialogRef: MatDialogRef<QrDisplayComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) { }

  ngOnInit(): void {
    this.api.genQR().subscribe({
      next: (res: any) => {
        this.email = res.data.email;
        this.issuer = res.data.issuer;
        this.qrCode = res.data.qrCode;
      }
    })
  }

  onCancel(){
    this.dialogRef.close();
  }

}
