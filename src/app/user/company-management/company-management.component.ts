import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';

import { AddUpdateCompanyComponent } from './add-update-company/add-update-company.component';

@Component({
  selector: 'app-company-management',
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
    MatOption,
    MatSelectModule
  ],
  templateUrl: './company-management.component.html',
  styleUrl: './company-management.component.css'
})
export class CompanyManagementComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private api = inject(AuthService);
  private dialog = inject(MatDialog);
  filterValues = { name: '', companyType: '', country: '' };


  displayedColumns: string[] = ['srNo', 'name', 'companyType', 'country'];
  dataSource = new MatTableDataSource<any>();

  constructor() {
    this.getCompany();
  }

  applyFilter() {
    console.log('Filters applied:', this.filterValues);
    // Call API here
  }

  clearFilters() {
    this.filterValues = { name: '', companyType: '', country: '' };
    this.applyFilter();
  }

  openAddCompany() {
    this.dialog.open(AddUpdateCompanyComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe((result: any) => {
      if (result) this.getCompany();
    });
  }

  getCompany() {
    this.api.getCompany().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
}
