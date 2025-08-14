import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS } from '../../core/constant/constant';
import { AuthService } from '../../core/services/auth.service';
import { PatternRestrictDirective } from '../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-email-otp',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    PatternRestrictDirective
  ],
  templateUrl: './email-otp.component.html',
  styleUrl: './email-otp.component.css'
})
export class EmailOtpComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);
  loading = false;
  pattern = VALIDATION_PATTERNS;
  otpForm!: FormGroup;
  userData: any;
  @ViewChildren('otpInput') inputs!: QueryList<ElementRef>;

  constructor() {
  }


  get otpControls() {
    return [0, 1, 2, 3];
  }

  ngOnInit() {
    this.otpForm = this.fb.group({
      digit0: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
  }

  autoFocusNext(event: any, index: number) {
    const value = event.target.value;
    const inputsArray = this.inputs.toArray();
    if (value && index < inputsArray.length - 1) {
      inputsArray[index + 1]?.nativeElement?.focus();
    }
  }

  resendOtp() {
    this.otpForm.reset();
    this.api.sendEmail().subscribe();
  }

  onSubmit() {
    const { digit0, digit1, digit2, digit3 } = this.otpForm.value;
    const otpValue = digit0 + digit1 + digit2 + digit3;
    console.log("value", otpValue);
    console.log("userinfo", this.userData);
    this.api.verifyEmail({ otp: otpValue }).subscribe({
      next: (res: any) => {
        this.checkLogin()
      }
    })
  }

  checkLogin() {
    this.api.checkLogin().subscribe({
      next: (res: any) => {
        if (res.data.nextRedirect == 'google2FAVerification') {
          this.router.navigateByUrl('/google-auth');
        } else if (res.data.nextRedirect == 'mobileVerification') {
          this.router.navigateByUrl('/mobile-verification');
        } else {
          this.router.navigateByUrl('');
        }
      }
    })
  }
}

