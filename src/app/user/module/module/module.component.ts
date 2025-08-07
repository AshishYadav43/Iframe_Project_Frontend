import { Component, inject } from '@angular/core';
import { AddModuleComponent } from './add-module/add-module.component';
import { AuthService } from '../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-module',
  imports: [],
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

}
