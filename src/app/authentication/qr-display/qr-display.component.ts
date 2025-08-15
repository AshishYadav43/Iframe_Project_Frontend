import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-qr-display',
  imports: [CommonModule],
  templateUrl: './qr-display.component.html',
  styleUrl: './qr-display.component.css'
})
export class QrDisplayComponent {

  loading = true;
  qrCode = '';
  email = '';
  issuer = '';
  private api = inject(AuthService);

  ngOnInit(): void {
    this.api.genQR().subscribe({
      next: (res: any) => {
        this.email = res.data.email;
        this.issuer = res.data.issuer;
        this.qrCode = res.data.qrCode;        
      }
    })
  }

}
