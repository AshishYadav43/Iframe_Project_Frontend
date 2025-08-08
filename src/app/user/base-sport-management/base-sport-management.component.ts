import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { AuthService } from '../../core/services/auth.service';

import { AddUpdateBaseSportComponent } from './add-update-base-sport/add-update-base-sport.component';

@Component({
  selector: 'app-base-sport-management',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './base-sport-management.component.html',
  styleUrl: './base-sport-management.component.css'
})
export class BaseSportManagementComponent {

  displayedColumns: string[] = ['srNo', 'name', 'sportId', 'action'];
  dataSource = new MatTableDataSource<any>();

  private api = inject(AuthService);
  private dialog = inject(MatDialog);

  constructor() {
    this.getBaseSports();
  }

  openAddSport() {
    this.dialog.open(AddUpdateBaseSportComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe(result => {
      if (result) this.getBaseSports();
    });
  }

  getBaseSports() {
    this.api.getAllBaseSports().subscribe({
      next: (res: any) => {
        console.log("RESPONSE", res);
        this.dataSource.data = res.data;
      }
    })
  }

  getSubtypeNames(row: any): string {
    return row?.sport_sub_type?.map((item: any) => item.name).join(', ') || '';
  }

  getSubtypeIds(row: any): string {
    return row?.sport_sub_type?.map((item: any) => item.id).join(', ') || '';
  }

  openEditSport(data: any) {
    this.dialog.open(AddUpdateBaseSportComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: data
    }).afterClosed().subscribe((result: any) => {
      if (result) this.getBaseSports();
    });
  }

}
