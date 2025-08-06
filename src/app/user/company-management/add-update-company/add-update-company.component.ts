import { Component, inject, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
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
import { COMPANY_SELECTION_V1 } from '../../../core/constant/constant';
import { startWith } from 'rxjs/operators';

interface SelectOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-update-company',
  standalone: true,
  templateUrl: './add-update-company.component.html',
  styleUrl: './add-update-company.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIcon,
    PatternRestrictDirective,
  ]
})
export class AddUpdateCompanyComponent {
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

  sportTypes: SelectOption[] = [
    { id: 'SPORTS', name: 'Sports' },
    { id: 'CASINO', name: 'Casino' },
    { id: 'ESPORTS', name: 'Esports' },
    { id: 'VIRTUAL_GAMING', name: 'Virtual Gaming' }
  ];

  countries: SelectOption[] = [];
  currencies: SelectOption[] = [];

  companySelectionOptions = Object.entries(COMPANY_SELECTION_V1).map(([key, value]) => ({ key, value }));

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<AddUpdateCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public companyData: any
  ) {
    this.getCountry();
    this.getCurrency();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      company_selection: [this.companyData?.companySelection || '', Validators.required],
      companyType: [this.companyData?.companyType || '', Validators.required],
      name: [this.companyData?.name || '', Validators.required],
      id: [this.companyData?.id || '', [Validators.required, Validators.minLength(3)]],
      supportedCurrencies: [this.companyData?.supportedCurrencies || [], Validators.required],
      country: [this.companyData?.country || '', Validators.required],
      apiPaths: this.fb.array(
        this.companyData?.apiPaths?.length
          ? this.companyData.apiPaths.map((p: string) => this.fb.group({ value: [p, Validators.required] }))
          : [this.fb.group({ value: ['', Validators.required] })]
      ),
      sportTypeAndSubType: this.fb.array([])
    });

    // Initialize sport type groups
    if (this.companyData?.sportTypeAndSubType?.length) {
      this.companyData.sportTypeAndSubType.forEach((item: any) => {
        this.addSportTypeGroup(item.typeId, item.subTypeId);
      });
    } else {
      this.addSportTypeGroup();
    }
  }

  // ====== API PATHS ======
  get apiPaths(): FormArray {
    return this.form.get('apiPaths') as FormArray;
  }

  addApiPath(): void {
    this.apiPaths.push(this.fb.group({ value: ['', Validators.required] }));
  }

  removeApiPath(index: number): void {
    if (this.apiPaths.length > 1) {
      this.apiPaths.removeAt(index);
    }
  }

  // ====== SPORT TYPE / SUBTYPE ======
  get sportTypeAndSubType(): FormArray {
    return this.form.get('sportTypeAndSubType') as FormArray;
  }

  addSportTypeGroup(initialType: any = '{}', initialSubType: string = '') {
    const group = this.fb.group({
      sport_category: [initialType, Validators.required],
      sub_types: [[initialSubType], Validators.required],
      sub_type_options: [[]],
      typeId: ['']
    });

    this.sportTypeAndSubType.push(group);

    if (initialType) {
      this.loadApiResults(initialType, group);
    }

    group.get('sport_category')?.valueChanges
      .pipe(startWith(initialType))
      .subscribe((typeName: any) => {
        this.loadApiResults(typeName, group);
      });
  }

  removeSportTypeGroup(index: number) {
    if (this.sportTypeAndSubType.length > 1) {
      this.sportTypeAndSubType.removeAt(index);
    }
  }

  loadApiResults(typeName: string, group: FormGroup) {
    const payload = { sport_type_name: typeName };
    this.api.getBaseSportSubType(payload).subscribe({
      next: (res: any) => {
        const baseType = res?.data?.[0];
        if (baseType) {
          group.patchValue({
            sub_type_options: baseType.sport_sub_type || [],
            typeId: baseType._id,
            sub_types: []
          });
        }
      },
      error: () => {
        group.patchValue({
          sub_type_options: [],
          typeId: '',
          sub_types: []
        });
      }
    });
  }

  // ====== FORM SUBMIT ======
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    const payload = {
      companySelection: formValue.company_selection,
      companyType: formValue.companyType,
      name: formValue.name,
      id: formValue.id,
      supportedCurrencies: formValue.supportedCurrencies,
      country: formValue.country,
      apiPaths: formValue.apiPaths.map((x: any) => x.value),
      sportTypeAndSubType: formValue.sportTypeAndSubType.map((item: any) => ({
        typeId: item.typeId,
        subTypeId: item.sub_types[0] || null
      }))
    };

    const request = this.companyData
      ? this.api.updateUser(payload)
      : this.api.addCompany(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        this.toaster.success('Company Saved Successfully');
      },
      error: (err: any) => {
        this.loading = false;
        this.toaster.error(err?.error?.message || 'Something went wrong');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  // ====== INIT DATA LOAD ======
  getCountry() {
    this.api.getAllCountries().subscribe({
      next: (res: any) => {
        this.countries = res.data.map((ele: any) => ({
          id: ele._id,
          name: ele.countryName
        }));
      }
    });
  }

  getCurrency() {
    this.api.getAllCurrencies().subscribe({
      next: (res: any) => {
        this.currencies = res.data.map((ele: any) => ({
          id: ele._id,
          name: ele.name
        }));
      }
    });
  }
}
