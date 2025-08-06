import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AddEditCasinoPageComponent } from './add-edit-casino-page/add-edit-casino-page.component';

@Component({
  selector: 'app-casino-management',
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,],
  templateUrl: './casino-management.component.html',
  styleUrl: './casino-management.component.css'
})
export class CasinoManagementComponent {

displayedColumns: string[] = ['srNo', 'name', 'company', 'sportType'];

  currencies = new MatTableDataSource<any>();
  dataSource = new MatTableDataSource<any>();
    selectedTabIndex = 0;

  constructor(private route: ActivatedRoute) {}

  private api = inject(AuthService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadSportsList();
  }

  loadSportsList() {    
    this.api.getAllCasino().subscribe(users => {
      this.dataSource.data = users.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openAddSport() {
    this.dialog.open(AddEditCasinoPageComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe(result => {
      if (result) this.loadSportsList();
    });
  }

  openEditUser(user: any) {
    this.dialog.open(AddEditCasinoPageComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: user
    }).afterClosed().subscribe(result => {
      if (result) this.loadSportsList();
    });
  }

  deleteUser(user: any) {
    // if (confirm(`Delete user ${user.name}?`)) {
    //   this.userService.deleteUser(user.id).subscribe(() => this.loadUsers());
    // }
  }

}
