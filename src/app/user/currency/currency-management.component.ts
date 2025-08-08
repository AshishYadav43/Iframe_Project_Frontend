import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { ToastrService } from 'ngx-toastr';

import { finalize } from 'rxjs';

import { log } from 'console';

import { VALIDATION_PATTERNS } from '../../core/constant/constant';
import { AuthService } from '../../core/services/auth.service';
import { PatternRestrictDirective } from '../../core/directives/directives/pattern-restrict.directive';

import { AddUpdateCurrencyComponent } from './add-update-currency/add-update-currency.component';
@Component({
  selector: 'app-currency-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    PatternRestrictDirective,
    MatSlideToggle
  ],
  templateUrl: './currency-management.component.html',
  styleUrl: './currency-management.component.css'
})
export class CurrencyManagementComponent {
  pattern = VALIDATION_PATTERNS;
  searchTerm: string = '';

  private api = inject(AuthService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);
  currencies = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  countries: any[] = [

  ];
  selectedCountry: any;
  currencyName = '';
  currencySymbol = '';
  conversionRate = '';
  limits: any[] = [];
  showForm = false;
  showLimits = false;
  loading = false;
  statusUpdating: boolean = false;
  displayedColumns: string[] = [
    'sno',
    'name',
    'symbol',
    'country',
    'conversionRate',
    'status',
    'action'
    // 'limits'
  ];

  currencyOptions = [
    { label: "INR - ₹", value: "INR" },
    { label: "PKR - ₨", value: "PKR" },
    { label: "BDT - ৳", value: "BDT" },
    { label: "IDR - Rp", value: "IDR" },
    { label: "CNY - ¥", value: "CNY" },
    { label: "VND - ₫", value: "VND" }
  ];


  ngOnInit() {
    this.getAllCountries()
    this.fetchCurrencies();
  }

  getAllCountries() {
    this.api.getAllCountries().subscribe({
      next: (res: any) => {
        this.countries = res.data || res;
      },
      error: (err: any) => {
      }
    });
  }

  fetchCurrencies() {
    this.loading = true;
    this.api.getAllCurrencies().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (res: any) => {
        this.currencies.data = res.data || res;
        this.currencies.paginator = this.paginator;
      }
      // error: () => this.toastr.error('Failed to fetch currencies')
    });
  }

  openForm() {
    this.dialog.open(AddUpdateCurrencyComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe((result: any) => {
      if (result) this.fetchCurrencies();
    });
  }

  cancel() {
    this.resetForm();
    this.showForm = false;
    this.showLimits = false;
  }

  resetForm() {
    this.currencyName = '';
    this.currencySymbol = '';
    this.conversionRate = '';
    this.selectedCountry = '';
    this.limits = [];
  }

  generateLimits() {
    this.showLimits = true;
    const limits = [];
    let group = 1, subgroup = 1, charCode = 65; // 'A'

    for (let i = 0; i < 100; i++) {
      const code = `${group} ${subgroup} ${String.fromCharCode(charCode)} CNY`;
      limits.push({ code, selected: false, min: 0, max: 100 });

      charCode++;
      if (charCode > 90) { // After 'Z'
        charCode = 65;
        subgroup++;
        if (subgroup > 9) {
          subgroup = 1;
          group++;
        }
      }
    }

    this.limits = limits;
  }

  save() {
    const selectedLimits = this.limits
      .filter(l => l.selected)
      .map(l => ({
        pre_fix: l.code,
        min_limit: l.min,
        max_limit: l.max
      }));

    const payload = {
      name: this.currencyName,
      symbol: this.currencySymbol,
      country: typeof this.selectedCountry === 'object' ? this.selectedCountry._id : this.selectedCountry,
      conversion_rate: +this.conversionRate,
      pre_fix: selectedLimits
    };

    this.loading = true;
    this.api.addCurrency(payload).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.toastr.success('Currency added successfully');
        this.cancel();
        this.fetchCurrencies();
      },
      // error: () => this.toastr.error('Failed to add currency')
    });
  }

  toggleStatus(country: any): void {
    this.statusUpdating = true;
    const updatedStatus = country.status == 1 ? 2 : 1;
    const payload = {
      _id: country._id,
      updatedData: {
        status: updatedStatus
      }
    };
    this.api.updateCurrency(payload).pipe(finalize(() => this.statusUpdating = false)).subscribe({
      next: () => {
        this.toastr.success('Status updated successfullly');
        this.fetchCurrencies();
      },
      error: () => {
        this.toastr.error('Failed to update status');
      }
    });
  }

  OpenEditCurrency(data: any) {
    const selectedLimit = data.pre_fix.map((ele: any) => {
      return {
        code: ele.pre_fix,
        min: ele.min_limit,
        max: ele.max_limit,
      }
    })
    const payload = { ...data, symbol: data.symbol.toUpperCase(), country: data.country._id,selectedCodes: selectedLimit }
    this.dialog.open(AddUpdateCurrencyComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: payload
    }).afterClosed().subscribe((result: any) => {
      if (result) this.fetchCurrencies();
    });
  }
}
