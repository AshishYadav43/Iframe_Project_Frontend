import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { VALIDATION_PATTERNS, PROVIDER_SELECTION_V1 } from '../../../core/constant/constant';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-market',
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
    MatSlideToggle],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css'
})
export class MarketComponent {
  pattern = VALIDATION_PATTERNS;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterValues = { marketName: '', status: '1', sort: '' };

  statusUpdating: boolean = false;
  marketData: any;
  displayedColumns: string[] = ['srNo', 'eventId', 'marketName', 'marketId', "action"];
  dataSource = new MatTableDataSource<any>();
  private api = inject(AuthService);
  //  private router=inject(Router)
  constructor(private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.marketData = history.state.marketData;
    this.getMarketList();
  }

  getMarketList() {
    this.api.getMarketByEvent({ eventId: this.marketData.eventId }).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err: any) => {

      }
    })
  }


  goBack() {
    window.history.back();
  }


  applyFilters() {
    const payload = {
      page: 1,
      limit: 100,
      isPaginated: true,
      eventId: this.marketData?.eventId,
      filters: {} as any
    };

    if (this.filterValues.marketName) {
      payload.filters.marketName = this.filterValues.marketName;
    }

    if (this.filterValues.status) {
      payload.filters.status = this.filterValues.status;
    }

    this.api.getMarketByEvent(payload).subscribe((res: any) => {
      this.dataSource.data = res.data || [];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  clearFilters() {
    this.filterValues = { marketName: '', status: '', sort: '' };
    this.applyFilters();
  }

  goToDetailsPage(row: any) {
    this.router.navigateByUrl('/details', { state: { marketData: row } });
  }
}
