import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { finalize } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import Fingerprint2 from 'fingerprintjs2';

import { VALIDATION_PATTERNS } from '../core/constant/constant';
import { AuthService } from '../core/services/auth.service';
import { PatternRestrictDirective } from '../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    RouterModule,
    PatternRestrictDirective
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);
  captchaUrl = '';
  captchaLoaded = false;
  fingerprintHash = '';
  resultMessage = '';
  resultClass = '';
  isLogin: boolean = false;

  loading = false; // Tracks API call status
  hidePassword: boolean = true;
  pattern = VALIDATION_PATTERNS;
  loginForm: FormGroup = this.fb.group({
    identifier: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^<>])[A-Za-z\d\S]{6,}$/)]],
    validCode: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{1,4}$/)
    ]]
  });

  constructor() {
    this.checkLogin();
  }

  ngOnInit(): void {
    // 👇 Generate fingerprint and load CAPTCHA
    Fingerprint2.get((components: any) => {
      this.fingerprintHash = Fingerprint2.x64hash128(
        components.map((c: any) => c.value).join(''),
        31
      );
      this.loadCaptcha();
    });
  }

  checkLogin() {
    this.api.checkLogin().subscribe({
      next: (res: any) => {
        if (res.data.isLoggedIn) {
          this.router.navigate(['']);
        }
      }
    })
  }

  loadCaptcha(): void {
    const timestamp = Date.now();
    this.captchaLoaded = false;
    this.captchaUrl = `https://node.fluc.eu/api/v1/users/captcha?fp=${this.fingerprintHash}&_t=${timestamp}`;
    this.resultMessage = '';
    this.resultClass = '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true; // Disable button
    delete this.loginForm.value.validCode;
    this.api.login(this.loginForm.value).pipe(finalize(() => this.loading = false)).subscribe({
      next: (res: any) => {
        if (res.data.steps.emailVerification) {
          this.router.navigateByUrl('/email-verification', { state: { steps: res.data.steps } }).then(() => history.replaceState({}, '', 'email-verification'));
        } else if (res.data.steps.google2FAVerification) {
          this.router.navigateByUrl('/google-auth', { state: { steps: res.data.steps } }).then(() => history.replaceState({}, '', 'google-auth'));
        }
        else {
          this.toaster.success("Login successfully");
          this.router.navigateByUrl('/users');
        }
      },
      error: (err: any) => {
        this.loadCaptcha();
      },
    });
  }
}
