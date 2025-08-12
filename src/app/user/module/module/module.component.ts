import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';

import { AddModuleComponent } from './add-module/add-module.component';

@Component({
  selector: 'app-module',
  imports: [
    MatIcon,
    MatPaginatorModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './module.component.html',
  styleUrl: './module.component.css'
})
export class ModuleComponent {

   displayedColumns: string[] = ['srNo', 'name','sportId'];
  dataSource = new MatTableDataSource<any>();

  private api = inject(AuthService);
  private dialog = inject(MatDialog);

  constructor() {
    this.getBaseSports();
  }

  openAddSport() {
    this.dialog.open(AddModuleComponent, {
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

}
