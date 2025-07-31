import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'wallet_type', 'mobileNumber', 'actions'];
  dataSource = new MatTableDataSource<any>();

  private userService = inject(AuthService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.dataSource.data = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        wallet_type: 'Basic',
        mobileNumber: '9876543210'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        wallet_type: 'Premium',
        mobileNumber: '8765432109'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        wallet_type: 'Enterprise',
        mobileNumber: '7654321098'
      }
    ];
    // this.userService.getUsers().subscribe(users => {
    //   this.dataSource.data = users;
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
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
