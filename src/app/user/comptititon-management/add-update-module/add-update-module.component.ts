import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { log } from 'console';

import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

interface SelectOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-update-module',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIcon,
    PatternRestrictDirective
  ],
  templateUrl: './add-update-module.component.html',
  styleUrl: './add-update-module.component.css'
})
export class AddUpdateModuleComponent {
  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;
  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);
  companyType: SelectOption[] = [
    { id: '3rd-party', name: 'THIRD_PARTY' },
    { id: 'Our Company', name: 'B2C' },
  ];
  sports: SelectOption[] = [
    // { id: 'Manual', name: 'MANUAL' },
    // { id: 'Lottery', name: 'LOTTERY' },
    // { id: 'Live', name: 'LIVE' },
    // { id: 'Virtual', name: 'VIRTUAL' },
    // { id: 'Table', name: 'TABLE' },
    // { id: 'Slot', name: 'SLOT' }
  ]
  companies: SelectOption[] = [];
  countries: SelectOption[] = [];
  currencies: SelectOption[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddUpdateModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public comptitionData: any
  ) {
    this.getCountry();
    this.getCurrency();
    this.getCompany();
    this.getSports();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      companySelection: ['', Validators.required],
      sport: ['', Validators.required],
      company: ['', Validators.required],
      country: ['', Validators.required],
      currency: ['', Validators.required],
      competitionId: ['', [Validators.required, Validators.minLength(3)]],
      competitionName: ['', [Validators.required, Validators.minLength(3)]],
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      marketName: ['', [Validators.required, Validators.minLength(3)]]
    });

    if (this.comptitionData) {
      this.form.patchValue(this.comptitionData);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // ✅ Close without saving
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.form.value;

    const request = this.comptitionData
      ? this.api.updateComptition(payload)
      : this.api.addComptition(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true); // ✅ Close dialog with success
        this.toaster.success("Competition Created Successfully");
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  getCountry() {
    this.api.getAllCountries().subscribe({
      next: (res: any) => {
        this.countries = res.data.map((ele: any) => {
          return {
            id: ele._id,
            name: ele.countryName
          }
        })
      }
    })
  }

  getCurrency() {
    this.api.getAllCurrencies().subscribe({
      next: (res: any) => {
        this.currencies = res.data.map((ele: any) => {
          return {
            id: ele._id,
            name: ele.name
          }
        })
      }
    })
  }

  getCompany() {
    this.api.getCompany().subscribe({
      next: (res: any) => {
        this.companies = res.data.map((ele: any) => {
          return {
            id: ele._id,
            name: ele.name
          }
        })
      }
    })
  }

  getSports() {
    this.api.getAllSports().subscribe({
      next: (res: any) => {
        this.sports = res.data.map((ele: any) => {
          return {
            id: ele._id,
            name: ele.sport_name
          }
        })
      }
    })
  }

}
