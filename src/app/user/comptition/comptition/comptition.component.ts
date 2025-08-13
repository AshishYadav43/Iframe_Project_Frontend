import { CommonModule, TitleCasePipe } from '@angular/common';
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
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS, PROVIDER_SELECTION_V1 } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-comptition',
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
    TitleCasePipe
  ],
  templateUrl: './comptition.component.html',
  styleUrl: './comptition.component.css'
})
export class ComptitionComponent {
  pattern = VALIDATION_PATTERNS;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterValues = { competitionName: '', status: '1', sort: '' };

  statusUpdating: boolean = false;
  displayedColumns: string[] = ['srNo', 'provider_type', 'competition_id', 'competition_name', 'competitionRegion', 'sport', 'eventCount', 'marketCount', "action"];
  dataSource = new MatTableDataSource<any>();
  public api = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router)
  constructor(private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getComptition();
  }

  getComptition() {
    this.api.getComptition().subscribe({
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
      filters: {} as any
    };

    // Add filters only if values exist
    if (this.filterValues.competitionName) {
      payload.filters.competitionName = this.filterValues.competitionName;
    }

    if (this.filterValues.status) {
      payload.filters.status = this.filterValues.status;
    }

    this.api.getComptition(payload).subscribe((res: any) => {
      this.dataSource.data = res.data || [];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  clearFilters() {
    this.filterValues = { competitionName: '', status: '', sort: '' };
    this.applyFilters();
  }

  toggleStatus(casino: any): void {
    this.toastr.info('We are working on it.');
  }

  getProviderLabel(status: number): string {
    const entry = Object.entries(PROVIDER_SELECTION_V1).find(([_, value]) => value === status);
    return entry ? entry[0] : 'Unknown';
  }

  goToEventPage(row: any) {
    this.router.navigateByUrl('/event', { state: { eventData: row } });
  }
}
