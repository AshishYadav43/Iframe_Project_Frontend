import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { finalize } from 'rxjs';

import { AuthService } from '../core/services/auth.service';

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
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(AuthService);

  loading = false; // Tracks API call status
  hidePassword: boolean = true;
  loginForm: FormGroup = this.fb.group({
    identifier: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true; // Disable button

    this.api.login(this.loginForm.value).pipe(finalize(() => this.loading = false)).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl('/users');
      },
      error: (err: any) => {
        console.error('Login error:', err);
      },
    });
  }
}
