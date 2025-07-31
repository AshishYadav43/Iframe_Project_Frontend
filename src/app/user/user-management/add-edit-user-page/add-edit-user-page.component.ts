import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-add-edit-user-page',
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
    PatternRestrictDirective
  ],
  templateUrl: './add-edit-user-page.component.html',
  styleUrls: ['./add-edit-user-page.component.css']
})
export class AddEditUserPageComponent implements OnInit {
  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;
  walletTypes = ['Basic', 'Premium', 'Enterprise'];

  private fb = inject(FormBuilder);
  private userService = inject(AuthService);

  constructor(
    private dialogRef: MatDialogRef<AddEditUserPageComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {}

  ngOnInit(): void {
    // ✅ Initialize form with userData if available
    this.form = this.fb.group({
      name: [this.userData?.name || '', Validators.required],
      email: [this.userData?.email || '', [Validators.required, Validators.email]],
      parentId: [this.userData?.parentId || ''],
      deviceId: [this.userData?.deviceId || ''],
      ipv4: [this.userData?.ipv4 || ''],
      ipv6: [this.userData?.ipv6 || ''],
      mobileNumber: [this.userData?.mobileNumber || '', Validators.required],
      userId: [this.userData?.userId || ''],
      wallet_type: [this.userData?.wallet_type || '', Validators.required],
      share: [this.userData?.share || '']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.form.value;

    // const request = this.userData
    //   ? this.userService.updateUser(this.userData.id, payload)
    //   : this.userService.addUser(payload);

    // request.subscribe({
    //   next: () => {
    //     this.loading = false;
    //     this.dialogRef.close(true); // ✅ Close dialog with success
    //   },
    //   error: (err) => {
    //     console.error('Error:', err);
    //     this.loading = false;
    //   }
    // });
  }

  onCancel(): void {
    this.dialogRef.close(false); // ✅ Close without saving
  }
}
