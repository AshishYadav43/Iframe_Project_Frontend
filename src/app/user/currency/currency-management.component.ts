import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
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
    MatCheckboxModule
  ],
  templateUrl: './currency-management.component.html',
  styleUrl: './currency-management.component.css'
})
export class CurrencyManagementComponent {
  searchTerm: string = '';

  private api = inject(AuthService);
  private toastr = inject(ToastrService);
  currencies: any[] = [];
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
  displayedColumns: string[] = [
   'name',
  'symbol',
  'country',
  'status',
  'conversionRate'
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
        console.error('Error loading countries:', err);
      }
    });
  }

  fetchCurrencies() {
    this.loading = true;
    this.api.getAllCurrencies().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (res: any) => this.currencies = res.data.data ,
      // error: () => this.toastr.error('Failed to fetch currencies')
    });
  }

  openForm() {
    this.resetForm();
    this.showForm = true;
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
}
