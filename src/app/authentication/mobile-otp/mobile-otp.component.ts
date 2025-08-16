import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS } from '../../core/constant/constant';
import { AuthService } from '../../core/services/auth.service';
import { PatternRestrictDirective } from '../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-mobile-otp',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    PatternRestrictDirective
  ],
  templateUrl: './mobile-otp.component.html',
  styleUrl: './mobile-otp.component.css'
})
export class MobileOtpComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);
  loading = false;
  pattern = VALIDATION_PATTERNS;
  otpForm!: FormGroup;
  steps: any;

  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.steps = nav?.extras.state?.['steps'];
    if (!this.steps) this.router.navigateByUrl('/login');
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
    const input = event.target;
    if (input.value && index < 3) {
      const nextInput = input.parentElement.parentElement
        .querySelectorAll('input')[index + 1];
      nextInput.focus();
    }
  }

  resendOtp() {
    this.otpForm.reset();
  }

  onSubmit() {
  }
}
