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

import { AuthService } from '../../core/services/auth.service';

import { AddUpdateModuleComponent } from './add-update-module/add-update-module.component';

@Component({
  selector: 'app-comptititon-management',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './comptititon-management.component.html',
  styleUrl: './comptititon-management.component.css'
})
export class ComptititonManagementComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['srNo', 'company', 'companySelection', 'competitionName', 'country', 'currency', 'eventName', 'marketName', 'sportType'];
  dataSource = new MatTableDataSource<any>();
  private api = inject(AuthService);
  private dialog = inject(MatDialog);

  constructor() { }

  ngOnInit(): void {
    this.getComptition();
  }

  getComptition() {
    this.api.getComptition().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;        
      },
      error: (err: any) => {

      }
    })
  }

  openAddComptition() {
    this.dialog.open(AddUpdateModuleComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe(result => {
      if (result) this.getComptition();
    });
  }
}
