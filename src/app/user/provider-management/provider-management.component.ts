import { CommonModule, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { AuthService } from '../../core/services/auth.service';

import { AddUpdateProviderComponent } from './add-update-provider/add-update-provider.component';
import { ViewProviderBaseTypeComponent } from './view-provider-base-type/view-provider-base-type.component';

@Component({
  selector: 'app-provider-management',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    TitleCasePipe
  ],
  templateUrl: './provider-management.component.html',
  styleUrl: './provider-management.component.css'
})
export class ProviderManagementComponent {

  displayedColumns: string[] = ['srNo', 'id', 'name', 'view', 'actions'];
  dataSource = new MatTableDataSource<any>();
  showButton: boolean = true;
  public api = inject(AuthService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor() {
    this.getProvider();
  }

  ngOnInit() {
  }

  OpenProviderModule() {
    this.dialog.open(AddUpdateProviderComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe((result: any) => {
      if (result) this.getProvider();
    });
  }

  openEditProvider(data: any) {
    this.dialog.open(AddUpdateProviderComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: data
    }).afterClosed().subscribe((result: any) => {
      if (result) this.getProvider();
    });
  }


  getProvider() {
    this.api.getProvider().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  openViewDialog(baseSports: any[]) {
    this.dialog.open(ViewProviderBaseTypeComponent, {
      width: '500px',
      data: {
        sportTypes: baseSports || []
      }
    });
  }
}
