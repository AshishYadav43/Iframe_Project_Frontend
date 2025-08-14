import { CommonModule, TitleCasePipe } from '@angular/common';
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
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { finalize } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { AddUpdateProviderComponent } from '../provider-management/add-update-provider/add-update-provider.component';
import { AuthService } from '../../core/services/auth.service';

import { AddDetailsComponent } from './add-details/add-details.component';
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
    MatSelectModule,
    MatSlideToggle,
    TitleCasePipe
  ],
  templateUrl: './company-management.component.html',
  styleUrl: './company-management.component.css'
})
export class CompanyManagementComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public api = inject(AuthService);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  filterValues = { name: '', companyType: '', sort: '' };
  statusUpdating: boolean = false;

  displayedColumns: string[] = ['srNo', 'name', 'companyId', 'companyType', 'country', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();

  companyType: any[] = [
    { id: 'SPORTS', name: 'Sports' },
    { id: 'FANCY', name: 'Fancy' },
    { id: 'CASINO', name: 'Casino' },
    { id: 'VIRTUALGAMING', name: 'Virtual Gaming' },
    { id: 'ESPORTS', name: 'Esports' },
  ];

  sortType: any[] = [
    { id: 'asc', name: 'ASC' },
    { id: 'desc', name: 'DESC' },
  ];
  constructor() {
    this.getCompany();
  }

  applyFilter() {
    // Call API here
  }

  clearFilters() {
    this.filterValues = { name: '', companyType: '', sort: '' };
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

  openAddProvider() {
    this.dialog.open(AddUpdateProviderComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe((result: any) => {
    });
  }

  getCurrencyNames(row: any): string {
    return row.supportedCurrencies?.map((c: any) => c.name).join(', ') || '';
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

  openEditCompany(data: any) {
    const payload = { ...data, companySelection: Number(data.companySelection) };
    payload.supportedCurrencies = payload.supportedCurrencies.map((ele: any) => ele._id);
    this.dialog.open(AddUpdateCompanyComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: payload
    }).afterClosed().subscribe((result: any) => {
      if (result) this.getCompany();
    });
  }

  // toggleStatus(data: any) {
  //   if (this.statusUpdating) return;
  //   this.statusUpdating = true;
  //   const payload = {
  //     _id: data._id,
  //     updatedData: {
  //       status: data.status == 1 ? 2 : 1
  //     }
  //   }
  //   this.api.updateCompany(payload).pipe(finalize(() => this.statusUpdating = false)).subscribe({
  //     next: (res: any) => {
  //       this.toastr.success("Status updated successfully");
  //     }
  //   })
  // }


  toggleStatus(user: any) {
    const prevStatus = user.status;
    const action = user.status == 1 ? 'block' : 'unblock'; // 1=active, 2=blocked
    user.status = user.status == 1 ? 2 : 1;

    this.dialog.open(MessageDialogComponent, {
      width: '600px',
      data: { action, name: "Company", data: user }
    }).afterClosed().subscribe(result => {
      // this.getCompany()
      if (result) {
        this.statusUpdating = true;

        const payload = {
          _id: user._id,
          updatedData: {
            status: prevStatus == 1 ? 2 : 1
          }
        };

        this.api.updateCompany(payload)
          .pipe(finalize(() => this.statusUpdating = false))
          .subscribe({
            next: (res: any) => {
              this.toastr.success("Status updated successfully");
              this.getCompany();
              user.status = payload.updatedData.status;
            },
            error: (err) => {
              this.toastr.error("Failed to update status");
              user.status = prevStatus;
            }
          });
      } else {
        // Dialog canceled — revert toggle UI by restoring status
        user.status = prevStatus;

      }
    });
  }

  openAddDetails(data: any) {
    this.dialog.open(AddDetailsComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: data
    }).afterClosed().subscribe((result: any) => {
      if (result) this.getCompany();
    });
  }
}
