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

import { startWith } from 'rxjs/operators';

import { log } from 'console';

import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { COMPANY_SELECTION_V1 } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

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
    // { id: 'SPORTS', name: 'Sports' },
    // { id: 'CASINO', name: 'Casino' },
    // { id: 'ESPORTS', name: 'Esports' },
    // { id: 'VIRTUAL_GAMING', name: 'Virtual Gaming' }
  ];

  countries: SelectOption[] = [];
  currencies: SelectOption[] = [];

  companySelectionOptions = Object.entries(COMPANY_SELECTION_V1).map(([key, value]) => ({ key, value }));

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);
  sportTypeAndSubTypeModel: { typeId: string; subTypeId: string[] }[] = [];
  subTypeOptionsMap: { [typeId: string]: any[] } = {};



  constructor(
    private dialogRef: MatDialogRef<AddUpdateCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public companyData: any
  ) {
    this.getSubType();
    this.getCountry();
    this.getCurrency();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      companySelection: [this.companyData?.companySelection || '', Validators.required],
      // companyType: [this.companyData?.companyType || '', Validators.required],
      name: [this.companyData?.name || '', Validators.required],
      id: [{ value: this.companyData?.id || '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      supportedCurrencies: [this.companyData?.supportedCurrencies || [], Validators.required],
      country: [this.companyData?.country?._id || '', Validators.required],
      apiPaths: this.fb.array(
        this.companyData?.apiPaths?.length
          ? this.companyData.apiPaths.map((p: string) => this.fb.group({ value: [p, Validators.required] }))
          : [this.fb.group({ value: ['', Validators.required] })]
      ),
      // sportTypeAndSubType: this.fb.array([])
    });

    // Initialize sport type groups
    // if (this.companyData?.sportTypeAndSubType?.length) {

    //   this.companyData.sportTypeAndSubType.forEach((item: any) => {            
    //     this.addSportTypeGroup(item.typeId, item.subTypeId);
    //   });
    // } else {
    //   this.addSportTypeGroup();
    // }

    if (this.companyData?.sportTypeAndSubType?.length) {
      this.sportTypeAndSubTypeModel = this.companyData.sportTypeAndSubType.map((item: any) => ({
        typeId: item.typeId,
        subTypeId: item.subTypeId || []
      }));
    } else {
      this.sportTypeAndSubTypeModel.push({ typeId: '', subTypeId: [] });
    }
    console.log("SUB TYPE", this.sportTypeAndSubTypeModel);

  }

  // ====== API PATHS ======
  get apiPaths(): FormArray {
    return this.form.get('apiPaths') as FormArray;
  }

  addApiPath(): void {
    console.log("ADD");

    this.apiPaths.push(this.fb.group({ value: ['', Validators.required] }));
  }

  removeApiPath(index: number): void {
    if (this.apiPaths.length > 1) {
      this.apiPaths.removeAt(index);
    }
  }

  onSportTypeChange(group: { typeId: string; subTypeId: string[] }) {
    if (!group.typeId) return;
    const index = this.sportTypes.findIndex(item => item.id == group.typeId);
    this.api.getBaseSportSubType({ sport_type_name: this.sportTypes[index].name }).subscribe(res => {
      this.subTypeOptionsMap[group.typeId] = res?.data?.[0]?.sport_sub_type || [];
      group.subTypeId = []; // reset selection
    });
  }

  // ====== SPORT TYPE / SUBTYPE ======
  get sportTypeAndSubType(): FormArray {
    return this.form.get('sportTypeAndSubType') as FormArray;
  }

  addSportTypeGroup(initialType: any = '{}', initialSubType: string = '') {
    console.log("ADD TYPE");

    this.sportTypeAndSubTypeModel.push({ typeId: '', subTypeId: [] });

    // const group = this.fb.group({
    //   sport_category: [initialType, Validators.required],
    //   sub_types: [[initialSubType], Validators.required],
    //   sub_type_options: [[]],
    //   typeId: ['']
    // });



    // this.sportTypeAndSubType.push(group);

    // if (initialType) {
    //   this.loadApiResults(initialType, group);
    // }

    // group.get('sport_category')?.valueChanges
    //   .pipe(startWith(initialType))
    //   .subscribe((typeName: any) => {        
    //     this.loadApiResults(typeName, group);
    //   });
  }


  getSubTypesFor(typeId: string): any[] {
    return this.subTypeOptionsMap[typeId] || [];
  }

  removeSportTypeGroup(index: number) {
    if (this.sportTypeAndSubTypeModel.length > 1) {
      this.sportTypeAndSubTypeModel.splice(index, 1);
    }
  }

  loadApiResults(typeName: any, group: FormGroup) {
    const payload = { sport_type_name: typeName.name };
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
    console.log("sportTypeAndSubTypeModel", this.sportTypeAndSubTypeModel);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    const payload = {
      companySelection: formValue.companySelection,
      // companyType: formValue.companyType,
      name: formValue.name,
      id: formValue.id,
      supportedCurrencies: formValue.supportedCurrencies,
      country: formValue.country,
      apiPaths: formValue.apiPaths.map((x: any) => x.value),
      sportTypeAndSubType: this.sportTypeAndSubTypeModel
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

  getSubType() {
    this.api.getBaseSportSubType().subscribe({
      next: (res: any) => {
        this.sportTypes = res.data.map((ele: any) => {
          return {
            name: ele.sport_type_name,
            id: ele._id
          }
        })
        console.log("SPORT TYPE", this.sportTypes);

      }
    })
  }
}
