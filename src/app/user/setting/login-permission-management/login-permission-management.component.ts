import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { log } from 'console';

@Component({
  selector: 'app-login-permission-management',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './login-permission-management.component.html',
  styleUrl: './login-permission-management.component.css'
})
export class LoginPermissionManagementComponent {
  roleData!: any;
  displayedColumns: string[] = ['srNo','name', 'actions'];
  dataSource = new MatTableDataSource<any>();
  private router = inject(Router);
  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.roleData = nav?.extras.state?.['roleData'];
  }

  ngOnInit() {
    if (!this.roleData) {
      this.router.navigate(['/role']);
    } else {
      this.dataSource.data = [
        { name: 'Email Otp',enabled: true },
        { name: 'Mobile Otp' ,enabled: true },
        { name: 'ON Screen Otp' ,enabled: true },
        { name: 'Telegram Otp' ,enabled: true },
        { name: 'DeviceId' ,enabled: true },
        { name: 'Geo Location' ,enabled: true },
        { name: 'Fingerprint' ,enabled: true },
        { name: 'Multi Login' ,enabled: true },
      ];
    }
  }

  onTogglePermission(row: any) {
    // You can call API to update status here
    // this.api.updatePermission(row.id, row.enabled).subscribe(...)
  }

}
