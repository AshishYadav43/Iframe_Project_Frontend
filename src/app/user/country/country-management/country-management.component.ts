import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { finalize } from 'rxjs';

import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

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
    PatternRestrictDirective,
  ],
  templateUrl: './country-management.component.html',
  styleUrls: ['./country-management.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CountryManagementComponent implements OnInit {
  pattern = VALIDATION_PATTERNS;
  submitted = false;
  loading = false;
  showForm = false;
  countryList: any[] = [];
  currencies = ['INR', 'NPR', 'USD'];
  timezones = ['Asia/Kolkata', 'Europe/London', 'UTC', 'America/New_York'];
  displayedColumns = ['countryName', 'countryId', 'countryCode', 'countryRegion', 'countryTimezones','numberCode', 'shortName','status'];

  countryForm!: FormGroup;
  private dialog = inject(MatDialog);

  private api = inject(AuthService);
  constructor(private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
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
        this.countryList = res.data || res;
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
}
