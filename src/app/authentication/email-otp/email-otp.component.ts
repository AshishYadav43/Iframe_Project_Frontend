import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

  constructor() { }
  
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

