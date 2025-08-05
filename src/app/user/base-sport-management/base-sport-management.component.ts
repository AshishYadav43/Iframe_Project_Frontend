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

  displayedColumns: string[] = ['srNo', 'name', 'company', 'sportType'];
  dataSource = new MatTableDataSource<any>();

  private api = inject(AuthService);
  private dialog = inject(MatDialog);

    openAddSport() {
      this.dialog.open(AddUpdateBaseSportComponent, {
        width: '600px',
        maxHeight: '90vh',
        autoFocus: false,
        data: null
      }).afterClosed().subscribe(result => {
        // if (result) this.loadSportsList();
      });
    }

}
