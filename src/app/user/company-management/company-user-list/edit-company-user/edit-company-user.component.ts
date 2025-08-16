import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ToastrService } from 'ngx-toastr';

import { log } from 'node:console';

import { finalize } from 'rxjs';

import { VALIDATION_PATTERNS } from '../../../../core/constant/constant';
import { AuthService } from '../../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-edit-company-user',
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
  templateUrl: './edit-company-user.component.html',
  styleUrl: './edit-company-user.component.css'
})
export class EditCompanyUserComponent {
  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<EditCompanyUserComponent>,
    @Inject(MAT_DIALOG_DATA) public companyUserData: any
  ) {
    if (!companyUserData) this.dialogRef.close(false);
  }

  ngOnInit(): void {
    if (!this.companyUserData) this.onCancel();
    this.form = this.fb.group({
      url: [this.companyUserData?.url || '', [Validators.required, Validators.minLength(3)]],
      userId: [this.companyUserData?.userId || '', [Validators.required, Validators.minLength(3)]],
      mobileNumber: [this.companyUserData?.mobileNumber || '', [Validators.required, Validators.minLength(10)]],
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {    
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const payload = {
      ...this.form.value,
      company: this.companyUserData.company._id,
      _id: this.companyUserData.id
    }
    this.api.updateCompanyUsers(payload).pipe(finalize(() => this.loading = false)).subscribe({
      next: (res: any) => {
        this.dialogRef.close(true);
        this.toaster.success(res.message);
      }
    })
  }
}
