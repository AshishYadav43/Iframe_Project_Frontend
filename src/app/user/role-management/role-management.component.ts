import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-role-management',
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
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent {
  displayedColumns: string[] = ['srNo', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  private api = inject(AuthService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor() { }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.api.getRole().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("RESPONSE", res.data);
      }
    })
  }

  openAddRole() {
    // this.dialog.open(AddEditUserPageComponent, {
    //   width: '600px',
    //   maxHeight: '90vh',
    //   autoFocus: false,
    //   data: null
    // }).afterClosed().subscribe(result => {
    //   if (result) this.loadUsers();
    // });
  }

  openEditRole(role: any) {
    // this.dialog.open(AddEditUserPageComponent, {
    //   width: '600px',
    //   maxHeight: '90vh',
    //   autoFocus: false,
    //   data: user
    // }).afterClosed().subscribe(result => {
    //   if (result) this.loadUsers();
    // });
  }

  deleteRole(role: any) {
    // if (confirm(`Delete user ${user.name}?`)) {
    //   this.userService.deleteUser(user.id).subscribe(() => this.loadUsers());
    // }
  }
}
