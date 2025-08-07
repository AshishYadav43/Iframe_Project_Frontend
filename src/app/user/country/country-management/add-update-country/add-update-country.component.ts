import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
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

import { VALIDATION_PATTERNS } from '../../../../core/constant/constant';
import { AuthService } from '../../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../../core/directives/directives/pattern-restrict.directive';

interface SelectOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-update-country',
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
  templateUrl: './add-update-country.component.html',
  styleUrl: './add-update-country.component.css'
})
export class AddUpdateCountryComponent {

  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;
  companyType: SelectOption[] = [
    { id: 'SPORTS', name: 'Sports' },
    { id: 'FANCY', name: 'Fancy' },
    { id: 'CASINO', name: 'Casino' },
    { id: 'VIRTUALGAMING', name: 'Virtual Gaming' },
    { id: 'ESPORTS', name: 'Esports' },
  ];

  currencies: SelectOption[] = [];

  countries: SelectOption[] = [];

  countryName: any[] = [];

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<AddUpdateCountryComponent>,
    @Inject(MAT_DIALOG_DATA) public countryData: any
  ) {
    this.getTimeZones();
  }

  ngOnInit(): void {
    // ✅ Initialize form with userData if available
    this.form = this.fb.group({
      // countryName: [this.countryData?.countryName || '', [Validators.required, Validators.minLength(3)]],
      // countryId: [this.countryData?.countryId ?? '', [Validators.minLength(3)]],
      // countryCode: [this.countryData?.countryCode || '', [Validators.required]],
countryName: [
  typeof this.countryData?.countryName === 'string'
    ? this.countryData.countryName
    : this.countryData?.countryName?.countryName || ''
],
      // shortName: [this.countryData?.shortName || '', [Validators.required]],
      // numberCode: [this.countryData?.numberCode || '', [Validators.required]],
      // countryRegion: [this.countryData?.countryRegion || ''],
    });

    // this.form.get('shortName')?.valueChanges.subscribe(value => {
    //   if (value) {
    //     this.form.get('shortName')?.setValue(value.toUpperCase(), { emitEvent: false });
    //   }
    // });
    // this.form.get('countryCode')?.valueChanges.subscribe(value => {
    //   if (value) {
    //     this.form.get('countryCode')?.setValue(value.toUpperCase(), { emitEvent: false });
    //   }
    // });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    // this.form.value.numberCode = Number(this.form.value.numberCode);
    const payload = this.form.value;

    const request = this.countryData
      ? this.api.updateCountry(payload)
      : this.api.addCountry(payload);

    request.subscribe({
      next: (res: any) => {
        this.loading = false;
        this.dialogRef.close(true); // ✅ Close dialog with success
        this.toaster.success(res.message);
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false); // ✅ Close without saving
  }

  getTimeZones() {
    this.api.getAllStaticComapany({}).subscribe({
      next: (res: any) => {
        this.countryName = res.data;
      }
    })
  }
}
