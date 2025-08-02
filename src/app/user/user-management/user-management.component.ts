import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../../core/services/auth.service';

import { AddEditUserPageComponent } from './add-edit-user-page/add-edit-user-page.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  displayedColumns: string[] = ['srNo','name','userId', 'email', 'mobileNumber'];
  dataSource = new MatTableDataSource<any>();
  showButton: boolean = false;
  private api = inject(AuthService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor() {
    this.getPermission();
  }

  ngOnInit() {
    this.loadUsers();
  }

  getPermission() {
    this.api.getPermission().subscribe({
      next: (res: any) => {
        if (res.data.roleId == 1) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      }
    })
  }

  loadUsers() {
    this.api.getUsers().subscribe(users => {
      this.dataSource.data = users.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openAddUser() {
    this.dialog.open(AddEditUserPageComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  openEditUser(user: any) {
    this.dialog.open(AddEditUserPageComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: user
    }).afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  deleteUser(user: any) {
    // if (confirm(`Delete user ${user.name}?`)) {
    //   this.userService.deleteUser(user.id).subscribe(() => this.loadUsers());
    // }
  }
}
