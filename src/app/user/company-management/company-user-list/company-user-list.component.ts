import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../core/services/auth.service';

import { EditCompanyUserComponent } from './edit-company-user/edit-company-user.component';

@Component({
  selector: 'app-company-user-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TitleCasePipe,
  ],
  templateUrl: './company-user-list.component.html',
  styleUrl: './company-user-list.component.css'
})
export class CompanyUserListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public api = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  filterValues = { userId: '', status: 1 };
  statusOption = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Inactive' }
  ]
  statusUpdating: boolean = false;
  companyData: any;

  displayedColumns: string[] = ['srNo', 'name', 'companyId', 'email', 'userId', 'mobileNumber', 'action'];
  dataSource = new MatTableDataSource<any>();
  totalRecords: number = 0;
  pageIndex: number = 0;
  pageSize: number = 50;

  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.companyData = nav?.extras.state?.['companyData'];
    if (!this.companyData) this.router.navigateByUrl('/country-management');
    else this.getUserList();
  }

  getUserList() {
    const payload = {
      company: this.companyData?._id,
      filters: this.filterValues,
      page: this.pageIndex + 1,
      limit: this.pageSize
    }
    this.api.getCompanyUsers(payload).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.totalRecords = 2;
      }
    })
  }

  applyFilter() {
    this.getUserList();
  }

  clearFilters() {
    this.filterValues = { userId: '', status: 1 };
    this.getUserList();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getUserList();
  }

  openEditCompanyUser(data: any) {
    this.dialog.open(EditCompanyUserComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: data
    }).afterClosed().subscribe((result: any) => {
      if (result) this.getUserList();
    });
  }

  openDeleteUser(data: any) {

  }

}
