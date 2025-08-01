import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-country-management',
  imports: [CommonModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule],
  templateUrl: './country-management.component.html',
  styleUrls: ['./country-management.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CountryManagementComponent {
  loading = false;
  displayedColumns: string[] = [
    'countryName',
    'countryId',
    'countryCode',
    'countryRegion',
    'countryTimezones',
    'status'
  ];


  private api = inject(AuthService);

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllCountries();
  }

  countryList: any[] = [];

  currencies = ['INR', 'NPR', 'USD'];
  timezones: string[] = ['Asia/Kolkata', 'Europe/London', 'UTC', 'America/New_York'];


  newCountry = {
    name: '',
    id: '',
    code: '',
    region: '',
    currency: '',
    timezone: []
  };

  showForm = false;

  saveCountry() {
    if (!this.newCountry.name || !this.newCountry.id || !this.newCountry.code || !this.newCountry.region || !this.newCountry.timezone.length) {
      this.toastr.error('Please fill all fields');
      return;
    }
    this.loading = true;
    const payload = {
      countryName: this.newCountry.name,
      countryId: this.newCountry.id,
      countryCode: this.newCountry.code,
      countryRegion: this.newCountry.region,
      countryTimezones: Array.isArray(this.newCountry.timezone)
        ? this.newCountry.timezone
        : [this.newCountry.timezone]
    };

    this.api.addCountry(payload).pipe(finalize(() => this.loading = false)).subscribe({
      next: () => {
        this.toastr.success('Country added successfully');
        this.getAllCountries();
        this.cancel();
        this.showForm = false;
      },
      error: (err) => {
      }
    });
  }

  getAllCountries() {
    this.api.getAllCountries().subscribe({
      next: (res: any) => {
        this.countryList = res.data || res;
      },
      error: (err: any) => {
      }
    });
  }

  cancel() {
    this.newCountry = {
      name: '',
      id: '',
      code: '',
      region: '',
      currency: '',
      timezone: []
    };
    this.showForm = false;
  }
}
