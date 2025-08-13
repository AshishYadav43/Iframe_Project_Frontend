import { Component, inject, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { BehaviorSubject, finalize } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { MessageDialogComponent } from '../../message-dialog/message-dialog.component';
import { STATUS_V1 } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { SharedDataService } from '../../../core/services/shared-data.service';

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
    MatInputModule,
    MatSlideToggle
  ],
  templateUrl: './casino-management.component.html',
  styleUrl: './casino-management.component.css'
})
export class CasinoManagementComponent {
  private casinoDataSubject = new BehaviorSubject<any[]>([]);
  casinoData$ = this.casinoDataSubject.asObservable();
  @Input() filters: { name: string; status: string } = { name: '', status: '' };

  displayedColumns: string[] = ['srNo', 'name', 'company', 'sportType', 'status', 'action'];

  currencies = new MatTableDataSource<any>();
  dataSource = new MatTableDataSource<any>();
  selectedTabIndex = 0;
  statusUpdating: boolean = false;
  private pendingPayload: any = null;
  constructor(private route: ActivatedRoute,
    private dataService: SharedDataService,
    private toastr: ToastrService
  ) { }

  public api = inject(AuthService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataService.casinoFilter$.subscribe(payload => {
      if (payload) {
        this.pendingPayload = payload;
        this.api.getAllCasino(this.pendingPayload).subscribe({
          next: (res: any) => {
            this.dataSource.data = res.data.map((item: any) => ({
              ...item,
              status: item.status
            }));

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        })
      } else {
        this.loadSportsList();
      }
    });

  }


  loadSportsList() {
    this.api.getAllCasino().subscribe(users => {
      this.dataSource.data = users.data;
      this.dataSource.data = users.data.map((item: any) => ({
        ...item,
        status: item.status
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

  openEditCasino(data: any) {
    this.dialog.open(AddEditCasinoPageComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: data
    }).afterClosed().subscribe((result: any) => {
      if (result) this.loadSportsList();
    });
  }

  toggleStatus(casino: any): void {
    const prevStatus = casino.status;
    if (this.statusUpdating) return;

    const updatedStatus = prevStatus == 1 ? 2 : 1;
    const payload = {
      _id: casino.id,
      updatedData: {
        status: updatedStatus
      }
    };
    const action = prevStatus == 1 ? 'block' : 'unblock';
    this.dialog.open(MessageDialogComponent, {
      width: '600px',
      data: { action }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.statusUpdating = true;
        this.api.updateCasino(payload).pipe(finalize(() => this.statusUpdating = false)).subscribe({
          next: () => {
            this.loadSportsList();
            casino.status = payload.updatedData.status;

            this.toastr.success('Status updated successfullly');
          },
          error: () => {
          }
        });
      } else {
        casino.status = prevStatus;

      }
    })
  }

}
