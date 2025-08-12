import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-add-update-provider',
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
  templateUrl: './add-update-provider.component.html',
  styleUrl: './add-update-provider.component.css'
})
export class AddUpdateProviderComponent {
  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<AddUpdateProviderComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {
  }


  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.userData?.name || '', [Validators.required, Validators.minLength(3)]],
      provider_id: [{ value: this.userData?.id || '', disabled: true }, [Validators.required, Validators.minLength(3)]],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    let payload = this.form.value;

    if (this.userData) {
      payload = {
        _id: this.userData._id,
        updatedData: {
          ...this.form.value
        }
      }
    }
    const request = this.userData ? this.api.updateProvider(payload) : this.api.addProvider(payload);
    request.subscribe({
      next: (res: any) => {
        this.loading = false;
        this.dialogRef.close(true);
        this.toaster.success(res.message);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

}
