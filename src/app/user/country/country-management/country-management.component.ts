import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { ToastrService } from 'ngx-toastr';

import { finalize } from 'rxjs';

import { CompanyManagementComponent } from '../../company-management/company-management.component';
import { CurrencyManagementComponent } from '../../currency/currency-management.component';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';

import { AddUpdateCountryComponent } from './add-update-country/add-update-country.component';

@Component({
  selector: 'app-country-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatPaginator,
    MatTabsModule,
    CurrencyManagementComponent,
    CompanyManagementComponent,
    MatSlideToggle
  ],
  templateUrl: './country-management.component.html',
  styleUrls: ['./country-management.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CountryManagementComponent implements OnInit {
  filterValues = {name: '', status: '1', sort: '' };
  selectedTabIndex = 0;
  pattern = VALIDATION_PATTERNS;
  submitted = false;
  loading = false;
  statusUpdating: boolean = false;
  showForm = false;
  countryList = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currencies = ['INR', 'NPR', 'USD'];
  timezones = ['Asia/Kolkata', 'Europe/London', 'UTC', 'America/New_York'];
  displayedColumns = [ 'srNo','countryName',];

  countryForm!: FormGroup;
  private dialog = inject(MatDialog);

  private api = inject(AuthService);
  constructor(private toastr: ToastrService, private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = +params['tab'];
      if (!isNaN(tab)) {
        setTimeout(() => {
          this.selectedTabIndex = tab;
        }, 0);
      }
    });
    this.getAllCountries();
    this.initForm();
  }

  initForm() {
    this.countryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      id: ['', [Validators.required, Validators.maxLength(4)]],
      code: ['', [Validators.required, Validators.maxLength(2)]],
      region: ['', [Validators.required, Validators.maxLength(30)]],
      currency: ['', Validators.required],
      timezone: [[], Validators.required]
    });
  }

  get f() {
    return this.countryForm.controls;
  }

  saveCountry() {
    this.submitted = true;

    if (this.countryForm.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    this.loading = true;

    const payload = {
      countryName: this.f['name'].value,
      countryId: this.f['id'].value,
      countryCode: this.f['code'].value,
      countryRegion: this.f['region'].value,
      countryTimezones: this.f['timezone'].value,
    };


    this.api.addCountry(payload).pipe(finalize(() => this.loading = false)).subscribe({
      next: () => {
        this.toastr.success('Country added successfully');
        this.getAllCountries();
        this.cancel();
      }
    });
  }

  getAllCountries() {
    this.api.getAllCountries().subscribe({
      next: (res: any) => {
        this.countryList.data = res.data || res;
        this.countryList.paginator = this.paginator;
      }
    });
  }

  cancel() {
    this.countryForm.reset();
    this.submitted = false;
    this.showForm = false;
  }

  openDialog() {
    this.dialog.open(AddUpdateCountryComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe((result: any) => {
      if (result) this.getAllCountries();
    });
  }


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

    if (this.filterValues.status) {
      payload.filters.status = this.filterValues.status;
    }

    this.api.getAllSports(payload).subscribe((res: any) => {
      // this.dataSource.data = res.data || [];
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    });
  }
}
