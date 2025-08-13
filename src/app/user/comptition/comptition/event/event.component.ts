import { CommonModule } from '@angular/common';
import { Component, Inject, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS, PROVIDER_SELECTION_V1 } from '../../../../core/constant/constant';
import { AuthService } from '../../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-event',
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOption,
    FormsModule,
    PatternRestrictDirective,
    ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  pattern = VALIDATION_PATTERNS;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterValues = { eventName: '', status: '1', sort: '' };
  eventData: any;
  statusUpdating: boolean = false;
  displayedColumns: string[] = ['srNo', 'EventId', 'eventname', 'compid', 'date', "name", "marketcount", "action"];
  dataSource = new MatTableDataSource<any>();
  private api = inject(AuthService);
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.eventData = history.state.eventData;
    this.getEventComptition();
  }

  getEventComptition() {
    this.api.getEventByCompId({ competitionId: this.eventData.competitionId }).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) => {

      }
    })
  }


  applyFilters() {
    const payload = {
      page: 1,
      limit: 100,
      isPaginated: true,
      competitionId: this.eventData?.competitionId,
      filters: {} as any,
    };

    if (this.filterValues.eventName) {
      payload.filters.eventName = this.filterValues.eventName;
    }
    if (this.filterValues.status) {
      payload.filters.status = this.filterValues.status;

    }
    this.api.getEventByCompId(payload).subscribe((res: any) => {
      this.dataSource.data = res.data || [];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  clearFilters() {
    this.filterValues = { eventName: '', status: '', sort: '' };
    this.applyFilters();
  }

  goToMarketPage(row: any) {
    this.router.navigateByUrl('/market', { state: { marketData: row } });
  }

  goBack() {
    window.history.back();
  }
}
