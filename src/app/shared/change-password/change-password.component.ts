import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS } from '../../core/constant/constant';
import { AuthService } from '../../core/services/auth.service';
import { PatternRestrictDirective } from '../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIcon,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PatternRestrictDirective],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;
  hidePassword: boolean = true;
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  hideGooglePassword: boolean = true;
  isOtpLengthValid = false; // OTP length check
  isOtpVerified = false;
  otpVerifiedLoading = false;

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any,
    private toastr: ToastrService,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.pattern(this.pattern.password)]],
      newPassword: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[^<>]{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      googleAuthOtp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d+$/)]]
    });

    this.form.valueChanges.subscribe(() => {
      const newPass = this.form.get('newPassword')?.value;
      const confirmPass = this.form.get('confirmPassword')?.value;

      if (confirmPass && newPass !== confirmPass) {
        this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        if (this.form.get('confirmPassword')?.hasError('mismatch')) {
          this.form.get('confirmPassword')?.setErrors(null);
        }
      }
      const otp = this.form.get('googleAuthOtp')?.value;
      this.isOtpLengthValid = otp && otp.length === 6 && /^[0-9]+$/.test(otp);
        this.isOtpVerified = false;
    });
  }


  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (!confirmPassword) return null;
    return newPassword == confirmPassword ? null : { passwordMismatch: true };
  }

  get confirmPasswordMismatch() {
    const confirmCtrl = this.form.get('confirmPassword');
    return (
      confirmCtrl?.dirty &&
      this.form.hasError('passwordMismatch') &&
      !confirmCtrl.hasError('required')
    );
  }



  verifyGoogleOTP(): void {
    const otp = this.form.get('googleAuthOtp')?.value;
    if (!otp) {
      this.toaster.error('Please enter OTP first');
      return;
    }
    this.api.verifyGoogleAuthOTP({ otp }).subscribe({
      next: (res: any) => {
        this.toaster.success('OTP verified successfully');
        this.isOtpVerified = res.data.verified
        // this.isOtpVerified = true;         
      },
      error: () => {
        this.isOtpVerified = true;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); return;
    }
    this.loading = true;
    const payload = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword,
      // googleAuthOtp: this.form.value.googleAuthOtp
    };
    this.api.changePassword(payload).
      subscribe({
        next: () => {
          this.toaster.success('Password changed successfully');
          this.dialogRef.close(true);
          this.api.logout().subscribe({
            next: (res: any) => {
              setTimeout(() => {
                this.router.navigateByUrl('/login');
              }, 3000);
            }
          })
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
