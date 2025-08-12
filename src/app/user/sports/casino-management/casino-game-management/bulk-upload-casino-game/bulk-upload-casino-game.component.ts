import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS, COMPANY_SELECTION_V1 } from '../../../../../core/constant/constant';
import { AuthService } from '../../../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-bulk-upload-casino-game',
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
  ],
  templateUrl: './bulk-upload-casino-game.component.html',
  styleUrl: './bulk-upload-casino-game.component.css'
})
export class BulkUploadCasinoGameComponent {
  pattern = VALIDATION_PATTERNS;
  companySelection = COMPANY_SELECTION_V1;
  companySelectionOptions = Object.entries(this.companySelection).map(([key, value]) => ({ key, value }));
  companies: { _id: string; name: string }[] = [];

  form!: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);
  providerOption: any[] = [];
  casinoOption: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<BulkUploadCasinoGameComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {
    this.getProvider();
    this.getCasino();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      provider: [this.userData?.provider?.id || '', Validators.required],
      company_type: [this.userData?.company_type || '', Validators.required],
      company: [this.userData?.company?.id || '', Validators.required],
      casino: [this.userData?.casino?.id || '', Validators.required],
    });

    this.form.get('company_type')!.valueChanges.subscribe(selectedCompanyType => {
      if (selectedCompanyType) {
        this.getCompany(selectedCompanyType);
      } else {
        this.companies = [];
        this.form.get('company')?.setValue('');
      }
    });
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

  getProvider() {
    this.api.getProvider().subscribe({
      next: (res: any) => {
        this.providerOption = res.data.map((ele: any) => {
          return {
            id: ele._id,
            name: ele.name
          }
        })
      }
    })
  }

  getCasino() {
    this.api.getAllCasino().subscribe({
      next: (res: any) => {
        this.casinoOption = res.data.map((ele: any) => {
          return {
            id: ele.id,
            name: ele.casinoName
          }
        })
      }
    })
  }

  onSubmit() {
    if (this.form.invalid) return;

    const payload = {...this.form.value}
    delete payload.company_type;

    this.api.addCasinoGame(payload).subscribe({
      next: (res: any) => {
        this.dialogRef.close(true);
        this.toaster.success(res.message);
      }
    })
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
