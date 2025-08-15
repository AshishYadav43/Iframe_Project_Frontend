import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS } from '../../core/constant/constant';
import { AuthService } from '../../core/services/auth.service';
import { PatternRestrictDirective } from '../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-google-auth',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    PatternRestrictDirective
  ],
  templateUrl: './google-auth.component.html',
  styleUrl: './google-auth.component.css'
})
export class GoogleAuthComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(AuthService);

  private toaster = inject(ToastrService);
  pattern = VALIDATION_PATTERNS;
  loginForm: FormGroup = this.fb.group({
    identifier: ['', Validators.required],
  });

  onSubmit() {
    const payload = {
      otp: Number(this.loginForm.value.identifier)
    }
    this.api.verifyGoogleAuth(payload).subscribe({
      next: (res: any) => {
        if (!res.data.verified) {
          this.toaster.error("OTP incorrect");
        }
        this.api.checkLogin().subscribe({
          next: (res: any) => {
            if (!res.data.nextRedirect) {
              this.router.navigateByUrl('/users');
            }
            
          }
        })

      }
    })
  }

  setupAuth() {
    this.router.navigateByUrl('/qr-display');

  }
}
