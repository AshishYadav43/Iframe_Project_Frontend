import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatDivider } from '@angular/material/divider';
import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-member',
  standalone: true,
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatDivider,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatStepperModule,
    MatCheckboxModule,
    MatStepper,
    PatternRestrictDirective
  ]
})
export class CreateMemberComponent {
  private api = inject(AuthService);
  private toastr = inject(ToastrService);
  pattern = VALIDATION_PATTERNS;
  step1Form!: FormGroup;
  currencyForm!: FormGroup;
  companyForm!: FormGroup;
  prefixAvailable = false;
  currencies: any[] = [];
  countries: any[] = [];
  currencyList: string[] = ['AUD', 'CAD', 'CMY', 'HKD', 'INR', 'LKR', 'MYR', 'NPR', 'PKR', 'SGD', 'THB', 'USD'];
  companyList: string[] = ['CompanyA', 'CompanyB', 'CompanyC', 'CompanyD'];

  productCurrencyList = [
    { product: 'BG_LIVE', currencies: { AUD: false, CAD: false, CMY: true } },
    { product: 'DRAGOONSOFT_SLOT', currencies: { AUD: true, CAD: true, CMY: true } },
    { product: 'DREAMGAMING_LIVE', currencies: { AUD: true, CMY: true } },
    { product: 'E1SPORT_ESPORTS', currencies: { CAD: true, INR: true, USD: true } },
  ];

  displayedColumns = ['product', ...this.currencyList];


  prefixOptions: (string | number)[] = [
    ...Array.from({ length: 10 }, (_, i) => i),
    ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))
  ];

  constructor(private fb: FormBuilder) {
    // Step 1 Form
    this.step1Form = this.fb.group({
      accountType: ['Agent'],
      userId: ['', [Validators.required, Validators.pattern('^[a-z0-9]{1,20}$')]],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      prefix1: ['', Validators.required],
      prefix2: ['', Validators.required],
      prefix3: ['', Validators.required],
      singleWallet: [false],
      clientApiSecretKey: [''],
      callbackUrl: [''],
    });

    // Currency Form
    const currencyControls: any = {};
    this.currencyList.forEach(currency => {
      currencyControls[currency] = [true];
    });
    this.currencyForm = this.fb.group(currencyControls);

    // Company Form
    const companyControls: any = {};
    this.companyList.forEach(company => {
      companyControls[company] = [true];
    });
    this.companyForm = this.fb.group(companyControls);
  }

  

  fetchCurrencies() {
    this.api.getAllCurrencies().subscribe({
      next: (res: any) => {
        this.currencies = res.data || res;
      }
    });
  }

  getAllCountries() {
    this.api.getAllCountries().subscribe({
      next: (res: any) => {
        this.countries = res.data || res;
      },
    });
  }

  generateRandomPrefix() {
    const getRandom = () => this.prefixOptions[Math.floor(Math.random() * this.prefixOptions.length)];
    this.step1Form.patchValue({
      prefix1: getRandom(),
      prefix2: getRandom(),
      prefix3: getRandom()
    });
    this.prefixAvailable = true;
  }

  toggleAllCurrencies(event: any) {
    const checked = event.checked;
    Object.keys(this.currencyForm.controls).forEach(key => {
      this.currencyForm.get(key)?.setValue(checked);
    });
  }

  allSelectedCurrencies(): boolean {
    return Object.values(this.currencyForm.value).every(val => val === true);
  }

  toggleAllCompanies(event: any) {
    const checked = event.checked;
    Object.keys(this.companyForm.controls).forEach(key => {
      this.companyForm.get(key)?.setValue(checked);
    });
  }

  allSelectedCompanies(): boolean {
    return Object.values(this.companyForm.value).every(val => val === true);
  }

  onSubmit() {
    const combinedData = {
      ...this.step1Form.value,
      currencies: this.currencyForm.value,
      companies: this.companyForm.value,
    };
    console.log('Final Submitted Data:', combinedData);
  }

}
