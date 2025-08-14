import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { ToastrService } from 'ngx-toastr';

import { map, Observable, startWith } from 'rxjs';

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
    PatternRestrictDirective,
    MatAutocompleteModule
  ],
  templateUrl: './add-update-country.component.html',
  styleUrl: './add-update-country.component.css'
})
export class AddUpdateCountryComponent {

  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;
  filteredCountryList!: Observable<any[]>;
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
    this.form = this.fb.group({
      id: [{ value: this.countryData?.id || '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      countryName: [
        typeof this.countryData?.countryName == 'string'
          ? this.countryData.countryName
          : this.countryData?.countryName?.countryName || ''
      ],
    });

    this.filteredCountryList = this.form.get('countryName')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountries(value || ''))
    );
  }

private _filterCountries(value: string): any[] {
  const filterValue = (value || '').toLowerCase();
  return filterValue
    ? this.countryName.filter(option =>
        option.countryName.toLowerCase().includes(filterValue)
      )
    : this.countryName;
}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.form.value;
    delete payload.id;
    const request = this.countryData
      ? this.api.updateCountry(payload)
      : this.api.addCountry(payload);

    request.subscribe({
      next: (res: any) => {
        this.loading = false;
        this.dialogRef.close(true);
        this.toaster.success(res.message);
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getTimeZones() {
    this.api.getAllStaticComapany({}).subscribe({
      next: (res: any) => {
        this.countryName = res.data;
      }
    })
  }
}
