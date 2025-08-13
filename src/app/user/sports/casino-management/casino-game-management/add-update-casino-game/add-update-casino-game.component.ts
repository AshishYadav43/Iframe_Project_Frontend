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

import { COMPANY_SELECTION_V1, VALIDATION_PATTERNS } from '../../../../../core/constant/constant';
import { AuthService } from '../../../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-add-update-casino-game',
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
    PatternRestrictDirective,],
  templateUrl: './add-update-casino-game.component.html',
  styleUrl: './add-update-casino-game.component.css'
})
export class AddUpdateCasinoGameComponent {
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
    private dialogRef: MatDialogRef<AddUpdateCasinoGameComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {
    this.getProvider();
    this.getCasino();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      provider: ['', Validators.required],
      company_type: ['', Validators.required],
      company: ['', Validators.required],
      casino: ['', Validators.required],
      gameId: ['', [Validators.required, Validators.minLength(3)]],
      gameName: ['', [Validators.required, Validators.minLength(3)]],
      gameCode: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.form.get('company_type')!.valueChanges.subscribe(selectedCompanyType => {
      if (selectedCompanyType) {
        this.getCompany(selectedCompanyType);
      } else {
        this.companies = [];
        this.form.get('company')?.setValue('');
      }
    });

    if (this.userData) {
      this.form.patchValue({
        provider: this.userData?.provider?._id,
        company_type: Number(this.userData?.companyType),
        company: this.userData?.company?._id,
        casino: this.userData?.casino?._id,
        gameName: this.userData?.gameName,
        gameCode: this.userData?.gameCode,
        gameId: this.userData?.gameId,
      });
    }
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
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    let payload = this.form.value;
    delete payload.company_type;
    
    if (this.userData) {
      payload = {
        _id: this.userData._id,
        updatedData: {
          ...this.form.value
        }
      }
    }
    const request = this.userData ? this.api.updateCasinoGame(payload) : this.api.addCasinoGame(payload);
    request.subscribe({
      next: (res: any) => {
        this.loading = false;
        this.dialogRef.close(true);
        this.toaster.success(res.message);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

}
