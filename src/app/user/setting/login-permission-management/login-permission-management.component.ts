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
import { MatOption, MatSelectModule } from '@angular/material/select';

import { log } from 'console';

import { AuthService } from '../../../core/services/auth.service';

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
    FormsModule,
    MatOption,
    MatSelectModule
  ],
  templateUrl: './login-permission-management.component.html',
  styleUrl: './login-permission-management.component.css'
})
export class LoginPermissionManagementComponent {
  roleData!: any;
  displayedColumns: string[] = ['srNo', 'name', 'role', 'user', 'actions'];
  dataSource = new MatTableDataSource<any>();
  private router = inject(Router);
  private api = inject(AuthService);
  options: any[] = [];
  userOptions: any[] = [];
  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.roleData = nav?.extras.state?.['roleData'];
    console.log("Role Data", this.roleData);
    this.getRole();
    this.getUser();
  }

  ngOnInit() {
    if (!this.roleData) {
      this.router.navigate(['/role']);
    } else {
      this.dataSource.data = [
        { name: 'Email Otp', enabled: true, role: this.roleData.id || '', multiRoles: [] },
        { name: 'Mobile Otp', enabled: true, role: this.roleData.id || '', multiRoles: [] },
        { name: 'ON Screen Otp', enabled: true, role: this.roleData.id || '', multiRoles: [] },
        { name: 'Telegram Otp', enabled: true, role: this.roleData.id || '', multiRoles: [] },
        { name: 'DeviceId', enabled: true, role: this.roleData.id || '', multiRoles: [] },
        { name: 'Geo Location', enabled: true, role: this.roleData.id || '', multiRoles: [] },
        { name: 'Fingerprint', enabled: true, role: this.roleData.id || '', multiRoles: [] },
        { name: 'Multi Login', enabled: true, role: this.roleData.id || '', multiRoles: [] },
      ];
    }
  }

  onTogglePermission(row: any) {
    // You can call API to update status here
    // this.api.updatePermission(row.id, row.enabled).subscribe(...)
  }

  onSelectionChange(row: any) {
    console.log(`Row ${row.name} selected option:`, row.selection);
  }

  toggleSelectAll(event: any, row: any) {
    if (event.value.includes('__all__')) {
      if (row.multiRoles.length - 1 === this.userOptions.length) {
        // Deselect all
        row.multiRoles = [];
      } else {
        // Select all
        row.multiRoles = this.userOptions.map(o => o.value);
      }
    }
  }

  handleSelectionChange(row: any) {
    if (row.multiRoles.includes('__all__')) {
      if (row.multiRoles.length - 1 === this.options.length) {
        // Already all selected -> Deselect all
        row.multiRoles = [];
      } else {
        // Select all options
        row.multiRoles = this.options.map(opt => opt.value);
      }
    }
  }

  getRole() {
    this.api.getRole().subscribe({
      next: (res: any) => {
        res.data.forEach((ele: any) => {
          this.options.push({
            value: ele.id,
            label: ele.name
          })
        });
      }
    })
  }

  getUser() {
    this.api.getUsers().subscribe({
      next: (res: any) => {
        console.log("USERS", res);
        this.userOptions = res.data.map((ele: any) => {
          return {
            value: ele._id,
            label: ele.userId
          }
        })

      }
    })
  }

}
