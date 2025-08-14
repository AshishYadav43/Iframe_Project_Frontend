import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { finalize } from 'rxjs';

import { AddUpdateCompanyComponent } from '../add-update-company/add-update-company.component';
import { VALIDATION_PATTERNS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-add-details',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIcon,
    PatternRestrictDirective
  ],
  templateUrl: './add-details.component.html',
  styleUrl: './add-details.component.css'
})
export class AddDetailsComponent {

  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;
  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<AddDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public companyData: any,
  ) {
    if (!companyData) this.dialogRef.close(false);
  }

  get formArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      items: this.fb.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      url: ['', Validators.required],
      userId: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      googleAuthenticatorKey: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  addItem(): void {
    this.formArray.push(this.createItem());
  }

  removeItem(index: number): void {
    this.formArray.removeAt(index);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
  onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    const payload = {
      company: this.companyData._id,
      details: this.form.value.items
    }

    this.api.addCompanyUsers(payload).pipe(finalize(() => this.loading = false)).subscribe({
      next: (res: any) => {
        this.dialogRef.close(true);
        this.toaster.success(res.message);
      }
    })
  }


}


