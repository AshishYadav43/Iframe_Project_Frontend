import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ToastrService } from 'ngx-toastr';

import { STATIC_SPORTS, VALIDATION_PATTERNS } from '../../../../core/constant/constant';
import { COMPANY_SELECTION_V1 } from '../../../../core/constant/constant';
import { AuthService } from '../../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../../core/directives/directives/pattern-restrict.directive';

interface SelectOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-edit-sport-page',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIcon,
    PatternRestrictDirective,],
  templateUrl: './add-edit-sport-page.component.html',
  styleUrl: './add-edit-sport-page.component.css'
})
export class AddEditSportPageComponent {
  pattern = VALIDATION_PATTERNS;

  form!: FormGroup;
  loading = false;


  // Convert object to array for *ngFor
  companySelection = COMPANY_SELECTION_V1;
  companySelectionOptions = Object.entries(this.companySelection).map(([key, value]) => ({ key, value }));

  // get the avialable sport type
  sport_sub_types: { id: number; name: string; _id: string }[] = [];

  countries: SelectOption[] = [];
  currencies: SelectOption[] = [];
  companies: { _id: string; name: string }[] = [];

  sportsString: string = Object.values(STATIC_SPORTS)
    .map(sport => `${sport.name} (${sport.id})`)
    .join(', ');

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<AddEditSportPageComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {
    this.loadApiResults();
    // this.getCompany();
    // this.getCurrency();
    // this.getCountry();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      company_type: [this.userData?.company_type || '', Validators.required],
      sport_name: [this.userData?.sportName || '', [Validators.required, Validators.minLength(3)]],
      company: [this.userData?.company?.id || '', Validators.required],
      base_sport: [{ value: this.userData?.base_sport || '', disabled: true }, Validators.required],
      sub_sports: [this.userData?.sub_sports || [], Validators.required],
      sport_id: [this.userData?.sportId || '', Validators.required],
      // country: [this.userData?.country || '', [Validators.required]],
      // currency: [this.userData?.currency || '', [Validators.required]],
    });

    this.form.get('company_type')!.valueChanges.subscribe(selectedCompanyType => {
      if (selectedCompanyType) {
        this.getCompany(selectedCompanyType);
      } else {
        this.companies = [];
        this.form.get('company')?.setValue('');
      }
    });

    this.form.patchValue({
      company_type: this.userData?.company_type,
      // country: this.userData.country.map((c: any) => c._id),
      // currency: this.userData.currency.map((c: any) => c._id),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.form.value.sport_id = Number(this.form.value.sport_id)
    // this.form.value.sub_sports = this.form.value.sport_sub_type
    let payload = this.form.value;
    if (this.userData) {
      payload = {
        _id: this.userData.id,
        updatedData: {
          ...this.form.value
        }
      }
    }

    const request = this.userData
      ? this.api.updateSport(payload)
      : this.api.addSport(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        this.toaster.success("Sport saved successfully");
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getCompany(companySelection?: number) {
    const payload = { filters: { companySelection: companySelection } };
    this.api.getCompany(payload).subscribe({
      next: (res: any) => {
        this.companies = res.data.map((ele: any) => {
          return {
            _id: ele._id,
            name: ele.name
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


  loadApiResults(sport_type_name?: string) {
    // If sport_type_name is empty or undefined, send no filter or a special value to get all results
    const payload = sport_type_name ? { sport_type_name: sport_type_name } : { sport_type_name: "SPORTS" };

    // api call to get the result
    this.api.getBaseSportSubType(payload).subscribe({
      next: (res: any) => {
        if (res.status == 'success' && res.data.length > 0) {

          // Directly assign the subtypes from res.data
          // Assuming res.data is array of subtypes, e.g.:
          // [{ id: 1, name: 'subOne', ... }, { id: 2, name: 'Sub Two', ... }]          
          this.sport_sub_types = res.data[0]?.sport_sub_type || [];

          // Reset selected items when new api results loaded
          this.form.get('sub_sports')?.setValue([]);
          if (this.userData) {
            this.form.get('sub_sports')?.setValue(this.userData.sub_sports);
          }
        }
        else {
          this.sport_sub_types = [];
          this.form.get('sub_sports')?.setValue([]);
        }
      }
    })
  }
}

