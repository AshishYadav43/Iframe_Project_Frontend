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
import { ActivatedRoute } from '@angular/router';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { finalize } from 'rxjs';

import { BlobOptions } from 'buffer';

import { ToastrService } from 'ngx-toastr';

import { CasinoManagementComponent } from '../casino-management/casino-management.component';
import { MessageDialogComponent } from '../../message-dialog/message-dialog.component';
import { CasinoGameManagementComponent } from '../casino-management/casino-game-management/casino-game-management.component';
import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { SharedDataService } from '../../../core/services/shared-data.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

import { AddEditSportPageComponent } from './add-edit-sport-page/add-edit-sport-page.component';

@Component({
  selector: 'app-sport-management',
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    PatternRestrictDirective,
    CasinoManagementComponent,
    MatOption,
    MatSlideToggle,
    CasinoGameManagementComponent
  ],
  templateUrl: './sport-management.component.html',
  styleUrl: './sport-management.component.css'
})
export class SportManagementComponent {
  casino: any
  pattern = VALIDATION_PATTERNS;
  displayedColumns: string[] = ['srNo', 'name', 'company', 'sportType', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  selectedTabIndex = 0;
  filterValues = { name: '', companyType: '1', sort: '' };
  filterCasinoValues = { casino_name: '', status: '1', sort: '' };
  statusUpdating: boolean = false;

  constructor(private route: ActivatedRoute,
    private dataService: SharedDataService,
    private toastr: ToastrService
  ) {
  }

  private api = inject(AuthService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  sortType: any[] = [
    { id: 'asc', name: 'ASC' },
    { id: 'desc', name: 'DESC' },
  ];

  applyFilters() {
    const payload = {
      page: 1,
      limit: 100,
      isPaginated: true,
      sort: this.filterValues.sort || 'desc',
      sortBy: 'createdAt',
      filters: {} as any
    };

    // Add filters only if values exist
    if (this.filterValues.name) {
      payload.filters.sport_name = this.filterValues.name;
    }

    if (this.filterValues.companyType) {
      payload.filters.status = this.filterValues.companyType;
    }

    this.api.getAllSports(payload).subscribe((res: any) => {
      this.dataSource.data = res.data || [];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  clearFilters() {
    if (this.selectedTabIndex === 0) {
      this.filterValues = { name: '', companyType: '', sort: '' };
      this.applyFilters();
    } else if (this.selectedTabIndex === 1) {
      this.filterCasinoValues = { casino_name: '', status: '', sort: '' };
      this.applyFilterForCasino();
    }
  }


  Status: any[] = [
    { id: '1', name: 'ACTIVE' },
    { id: '2', name: 'INACTIVE' },

  ];

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

  openEditSports(data: any) {
    this.dialog.open(AddEditSportPageComponent, {
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
    casino.status = casino.status === 1 ? 2 : 1;

    if (this.statusUpdating) return;

    const updatedStatus = casino.status == 1 ? 2 : 1;
    const payload = {
      _id: casino.id,
      updatedData: {
        status: updatedStatus
      }
    };
    const action = casino.status == 1 ? 'block' : 'unblock';
    this.dialog.open(MessageDialogComponent, {
      width: '600px',
      data: { action }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.statusUpdating = true;
        this.api.updateSport(payload).pipe(finalize(() => this.statusUpdating = false)).subscribe({
          next: () => {
            this.loadSportsList();
            this.toastr.success('Status updated successfullly');
            casino.status = payload.updatedData.status;

          },
          error: () => {
          }
        });
      } else {
        casino.status = prevStatus;

      }
    })
  }


  applyFilterForCasino() {
    const payload = {
      page: 1,
      limit: 100,
      isPaginated: "true",
      filters: {} as any
    };

    if (this.filterCasinoValues.casino_name) {
      payload.filters.casino_name = this.filterCasinoValues.casino_name;
    }

    if (this.filterCasinoValues.status) {
      payload.filters.status = this.filterCasinoValues.status;
    }

    if (this.selectedTabIndex === 0) {
      this.api.getAllSports(payload).subscribe((res: any) => {
        this.dataSource.data = res.data || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else if (this.selectedTabIndex === 1) {
      this.dataService.setCasinoFilter(payload); // pass payload to <app-casino-management>
    }
  }






}
