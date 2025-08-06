import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddEditSportPageComponent } from './add-edit-sport-page/add-edit-sport-page.component';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CasinoManagementComponent } from '../casino-management/casino-management.component';
import { STATUS_V1 } from '../../../core/constant/constant';

@Component({
  selector: 'app-sport-management',
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    CasinoManagementComponent,
  ],
  templateUrl: './sport-management.component.html',
  styleUrl: './sport-management.component.css'
})
export class SportManagementComponent {

displayedColumns: string[] = ['srNo', 'name', 'company', 'sportType','status'];
  dataSource = new MatTableDataSource<any>();
    selectedTabIndex = 0;

  constructor(private route: ActivatedRoute) {}

  private api = inject(AuthService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadSportsList();
     this.route.queryParams.subscribe(params => {
      const tab = +params['tab'];
      if (!isNaN(tab)) {
        setTimeout(() => {
          this.selectedTabIndex = tab;
        }, 0);
      }
    });
  }

  loadSportsList() {
    this.api.getAllSports().subscribe(users => {
      this.dataSource.data = users.data;
      this.dataSource.data = users.data.map((item: any) => ({
        ...item,
        status: STATUS_V1[item.status] || 'UNKNOWN'
      }));

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openAddSport() {
    this.dialog.open(AddEditSportPageComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe(result => {
      if (result) this.loadSportsList();
    });
  }

  openEditUser(user: any) {
    this.dialog.open(AddEditSportPageComponent, {
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
