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

import { ToastrService } from 'ngx-toastr';

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
  displayedColumns: string[] = ['srNo', 'name', 'role', 'user', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  private router = inject(Router);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);
  options: any[] = [];
  userOptions: any[] = [];
  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.roleData = nav?.extras.state?.['roleData'];
    this.getRole();
    if (this.roleData) {
      this.getUser(this.roleData.id);
    }
  }

  ngOnInit() {
    this.dataSource.data = [
      { name: 'Email Varification', name_value: 'emailVerification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'Mobile Varification', name_value: 'mobileVerification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'ON Screen Otp Varification', name_value: 'onScreenOTPVerification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'Telegram Varification', name_value: 'telegramVerification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'Ip Address Verification', name_value: 'ipAddressVerification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'IPv4 Verification', name_value: 'IPv4Verification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'IPv6 Verification', name_value: 'IPv6Verification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'DeviceId Verification', name_value: 'deviceIdVerification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'Geo Location Verification', name_value: 'useGeoLocationVerification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'Fingerprint Verification', name_value: 'fingerprintVerification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
      { name: 'Multi Login Verification', name_value: 'multiLoginVerification', enabled: '', role: this.roleData?.id || '', multiRoles: [] },
    ];
  }

  onTogglePermission(row: any) {
    // You can call API to update status here
    // this.api.updatePermission(row.id, row.enabled).subscribe(...)
  }

  onSelectionChange(row: any) {
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

  getUser(roleId: string = this.roleData?.id || '') {
    const payload = { type: roleId };
    this.api.getUsers(payload).subscribe({
      next: (res: any) => {
        this.userOptions = res.data.map((ele: any) => {
          return {
            value: ele._id,
            label: ele.userId
          }
        })
      }
    })
  }

  onRoleChange(data: any, event: any) {
    this.getUser(event.value);
  }

  onActionClick(row: any) {
    if (!row.role) { 
      this.toaster.error("Please Select the Roles");
      return; 
    }
    if (!row.multiRoles.length) {
      this.toaster.error("Please Select the Users");
      return;
    }
    const payload: any = {
      [row.name_value]: true,
      userIds: row.multiRoles,
      roleId: row.role,
      status: Number(row.enabled)
    }
    this.api.addLoginPermission(payload).subscribe({
      next: (res: any) => {
        this.toaster.success("Login Permission have been change successfully");   
        row.multiRoles = [];
        row.enabled = ''; 
      }
    })
  }
}
