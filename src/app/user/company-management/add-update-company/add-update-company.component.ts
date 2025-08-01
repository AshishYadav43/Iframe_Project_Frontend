import { Component, inject, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

interface SelectOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-update-company',
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
  templateUrl: './add-update-company.component.html',
  styleUrl: './add-update-company.component.css'
})
export class AddUpdateCompanyComponent {
  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<AddUpdateCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public companyData: any
  ) {
    this.getCurrency();
    this.getCountry();
  }

  companyType: SelectOption[] = [
    { id: 'SPORTS', name: 'Sports' },
    { id: 'FANCY', name: 'Fancy' },
    { id: 'CASINO', name: 'Casino' },
    { id: 'VIRTUALGAMING', name: 'Virtual Gaming' },
    { id: 'ESPORTS', name: 'Esports' },
  ];

  currencies: SelectOption[] = [];

  countries: SelectOption[] = [];

  ngOnInit(): void {
    // ✅ Initialize form with userData if available
    this.form = this.fb.group({
      companyType: [this.companyData?.companyType || '', Validators.required],
      name: [this.companyData?.name || '', [Validators.required]],
      id: [this.companyData?.id || ''],
      supportedCurrencies: [this.companyData?.supportedCurrencies || ''],
      country: [this.companyData?.ipv6 || ''],
      apiPaths: this.fb.array(this.companyData?.apiPaths?.length
        ? this.companyData.apiPaths.map((p: string) => this.fb.control(p, Validators.required))
        : [this.fb.control('', Validators.required)]
      )
    });
  }

  get apiPaths(): FormArray {
    return this.form.get('apiPaths') as FormArray;
  }

  // Add new API path
  addApiPath() {
    this.apiPaths.push(this.fb.control('', Validators.required));
  }

  // Remove API path
  removeApiPath(index: number) {
    if (this.apiPaths.length > 1) {
      this.apiPaths.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.form.value;

    const request = this.companyData
      ? this.api.updateUser(payload)
      : this.api.addCompany(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true); // ✅ Close dialog with success
        this.toaster.success("User Created Successfully");
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false); // ✅ Close without saving
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
}
