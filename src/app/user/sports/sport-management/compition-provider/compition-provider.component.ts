import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../../core/services/auth.service';
import { AddUpdateModuleComponent } from '../../../comptititon-management/add-update-module/add-update-module.component';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { VALIDATION_PATTERNS, PROVIDER_SELECTION_V1 } from '../../../../core/constant/constant';
import { PatternRestrictDirective } from '../../../../core/directives/directives/pattern-restrict.directive';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggle } from "@angular/material/slide-toggle";

@Component({
  selector: 'app-compition-provider',
  imports: [
    CommonModule,
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
    MatSlideToggle
], templateUrl: './compition-provider.component.html',
  styleUrl: './compition-provider.component.css'
})
export class CompitionProviderComponent {
  pattern = VALIDATION_PATTERNS;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterValues = { competitionName: '', status: '1', sort: '' };

  statusUpdating: boolean = false;
  displayedColumns: string[] = ['srNo', 'provider_type','competition_id', 'competition_name', 'competitionRegion', "status"];
  dataSource = new MatTableDataSource<any>();
  private api = inject(AuthService);
  private dialog = inject(MatDialog);

  constructor(private toastr: ToastrService) { }

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
}
