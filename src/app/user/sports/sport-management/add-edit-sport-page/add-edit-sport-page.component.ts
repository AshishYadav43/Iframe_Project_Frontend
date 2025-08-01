import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { VALIDATION_PATTERNS } from '../../../../core/constant/constant';
import { PatternRestrictDirective } from '../../../../core/directives/directives/pattern-restrict.directive';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-add-edit-sport-page',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIcon,
    PatternRestrictDirective,],
  templateUrl: './add-edit-sport-page.component.html',
  styleUrl: './add-edit-sport-page.component.css'
})
export class AddEditSportPageComponent {
   pattern = VALIDATION_PATTERNS;

  form!: FormGroup;
  loading = false;

  companies = ['Company A', 'Company B', 'Company C'];
  sportTypes = ['Cricket', 'Football', 'Tennis', 'Basketball'];

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<AddEditSportPageComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      sport_name: [this.userData?.sport_name || '', Validators.required],
      company: [this.userData?.company || '', Validators.required],
      sport_type: [this.userData?.sport_type || '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.form.value;

    const request = this.userData
      ? this.api.updateSport(payload)
      : this.api.addSport(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        this.toaster.success("Sport saved successfully");
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

