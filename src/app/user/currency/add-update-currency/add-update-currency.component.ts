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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-add-update-currency',
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
    MatCheckboxModule,
    MatListModule
  ],
  templateUrl: './add-update-currency.component.html',
  styleUrl: './add-update-currency.component.css'
})
export class AddUpdateCurrencyComponent {

  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;

  compareCodes = (o1: any, o2: any) => o1.code === o2.code;

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);
  countries: any[] = [];

  currencyOptions = [
    { label: "INR - ₹", value: "INR" },
    { label: "PKR - ₨", value: "PKR" },
    { label: "BDT - ৳", value: "BDT" },
    { label: "IDR - Rp", value: "IDR" },
    { label: "CNY - ¥", value: "CNY" },
    { label: "VND - ₫", value: "VND" }
  ];

  constructor(
    private dialogRef: MatDialogRef<AddUpdateCurrencyComponent>,
    @Inject(MAT_DIALOG_DATA) public currencyData: any
  ) {
    this.getCountry();
    this.generateLimits();
  }

  limitsControls: any = [
    { code: 'USD', min: '', max: '' },
    { code: 'EUR', min: '', max: '' },
    { code: 'INR', min: '', max: '' }
  ];
  ngOnInit(): void {
    // ✅ Initialize form with userData if available
    this.form = this.fb.group({
      name: [this.currencyData?.name || '', Validators.required],
      conversion_rate: [this.currencyData?.conversion_rate || '', [Validators.required]],
      country: [this.currencyData?.country || '', Validators.required],
      symbol: [this.currencyData?.symbol || '', Validators.required],
      selectedCodes: [this.currencyData?.selectedCodes || '', Validators.required],

    });
  }


  get selectedCodesDisplay() {
    const selected = this.form.get('selectedCodes')?.value || [];
    return selected.map((c: any) => `${c.code} (${c.min}-${c.max})`).join(', ');
  }

  onMinMaxChange(limit: any, key: 'min' | 'max', value: string) {
    limit[key] = value;
    const selected = this.form.get('selectedCodes')?.value || [];
    const index = selected.findIndex((c: any) => c.code === limit.code);
    if (index > -1) {
      selected[index][key] = value;
      this.form.get('selectedCodes')?.setValue([...selected]);
    }
  }

  getCountry() {
    this.api.getAllCountries().subscribe({
      next: (res: any) => {
        this.countries = res.data.map((ele: any) => {
          return {
            _id: ele._id,
            name: ele.countryName
          }
        })
      }
    })
  }

  generateLimits() {
    const limits = [];
    let group = 1, subgroup = 1, charCode = 65; // 'A'

    for (let i = 0; i < 100; i++) {
      const code = `${group} ${subgroup} ${String.fromCharCode(charCode)} CNY`;
      limits.push({ code, min: 0, max: 100 });

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

    this.limitsControls = limits;
    console.log("LIMITS", this.limitsControls);

  }

  onSubmit() {
    const payload: any = { 
      name: this.form.value.name, 
      symbol: this.form.value.symbol, 
      country: this.form.value.country, 
      conversion_rate: Number(this.form.value.conversion_rate),
      pre_fix: this.form.value.selectedCodes
    }
    payload.pre_fix = payload.pre_fix.map((ele: any) => {
      return {
        pre_fix: ele.code,
        min_limit: ele.min,
        max_limit: ele.max
      }
    });

        const request = this.currencyData
      ? this.api.updateSport(payload)
      : this.api.addCurrency(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        this.toaster.success("Currency saved successfully");
      },
      error: () => {
        this.loading = false;
      }
    });
    console.log("FORM VALUE", payload);
    
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}

