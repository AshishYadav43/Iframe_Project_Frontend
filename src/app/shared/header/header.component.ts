import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ChangePasswordComponent } from '../change-password/change-password.component';
import { AuthService } from '../../core/services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule,TitleCasePipe, MatMenuModule, ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private api = inject(AuthService)
  roleData!: any;

  logOut() {
    this.api.logout().subscribe({
      next: (res: any) => {
        this.router.navigate(['/login']);
      }
    })
  }
  
  constructor() {
    this.api.getPermission().subscribe({
      next: (res: any) => {
        this.roleData = res.data;        
      }
    })
  }


openChangePassword() {
  this.dialog.open(ChangePasswordComponent, {
    width: '600px',
    maxHeight: '90vh',
    autoFocus: false,
    data: null
  }).afterClosed().subscribe(result => {
    if (result) {
      // Yaha par aap result handle kar sakte ho
    }
  });
}


}
