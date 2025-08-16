import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator } from '../../../core/validation/custom-validation';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-add-edit-admin-user-page',
  standalone: true,
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
  ],
  templateUrl: './add-edit-admin-user-page.component.html',
  styleUrls: ['./add-edit-admin-user-page.component.css']
})
export class AddEditAdminUserPageComponent implements OnInit {
  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  walletTypes = ['Basic', 'Premium', 'Enterprise'];

  private fb = inject(FormBuilder);
  private userService = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<AddEditAdminUserPageComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) { }

  ngOnInit(): void {
    // ✅ Initialize form with userData if available
    this.form = this.fb.group({
      name: [this.userData?.name || '', Validators.required],
      email: [this.userData?.email || '', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]],
      mobileNumber: [this.userData?.mobileNumber || '', Validators.required],
      userId: [this.userData?.userId || '', Validators.required],
    });

    if (!this.userData) {
      this.form.addControl('password', this.fb.control('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^<>])[A-Za-z\d\S]{6,}$/)]));
      this.form.addControl('confirmPassword', this.fb.control('', [Validators.required]));
      this.form.setValidators(passwordMatchValidator("password", "confirmPassword"));
      this.form.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    delete this.form.value.confirmPassword;
    const payload = this.form.value;

    const request = this.userData
      ? this.userService.updateUser(payload)
      : this.userService.addSuperAgent(payload);

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
}
