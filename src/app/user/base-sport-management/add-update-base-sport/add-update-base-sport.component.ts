import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ToastrService } from 'ngx-toastr';

import { log } from 'console';

import { VALIDATION_PATTERNS, STATIC_SPORTS } from '../../../core/constant/constant';
import { AuthService } from '../../../core/services/auth.service';
import { AddEditSportPageComponent } from '../../sports/sport-management/add-edit-sport-page/add-edit-sport-page.component';
import { PatternRestrictDirective } from '../../../core/directives/directives/pattern-restrict.directive';

@Component({
  selector: 'app-add-update-base-sport',
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
  templateUrl: './add-update-base-sport.component.html',
  styleUrl: './add-update-base-sport.component.css'
})
export class AddUpdateBaseSportComponent {
  pattern = VALIDATION_PATTERNS;
  form!: FormGroup;
  loading = false;

  companies: { _id: string; name: string }[] = [];
  sportTypes: { _id: string; name: string }[] = [
    { _id: "MANUAL", name: "Manual" },
    { _id: "LOTTERY", name: "Lottery" },
    { _id: "LIVE", name: "Live" },
    { _id: "VIRTUAL", name: "Virtual" },
    { _id: "TABLE", name: "Table" },
    { _id: "SLOT", name: "Slot" }
  ];

  sportsString: string = Object.values(STATIC_SPORTS)
    .map(sport => `${sport.name} (${sport.id})`)
    .join(', ');

  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  private toaster = inject(ToastrService);

  constructor(
    private dialogRef: MatDialogRef<AddEditSportPageComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {        
    this.getCompany();
  }

  ngOnInit(): void {
    
    this.form = this.fb.group({
      sport_type_name: [this.userData?.sport_type_name || '', [Validators.required, Validators.minLength(3)]],
      sport_type_id: [{value: this.userData?.sport_type_id || '', disabled: true}, [Validators.required]],
      apiPaths: this.fb.array([this.createApiPath()])
    });

    if (this.userData?.sport_sub_type?.length) {
    this.patchApiPaths(this.userData.sport_sub_type);
  }
  }

  get apiPaths(): FormArray {
    return this.form.get('apiPaths') as FormArray;
  }

  patchApiPaths(paths: { id: string; name: string }[]) {
  const apiPathsFormArray = this.apiPaths;

  while (apiPathsFormArray.length !== 0) {
    apiPathsFormArray.removeAt(0);
  }
  paths.forEach(path => {
    const group = this.fb.group({
      id: [{ value: path.id, disabled: true }, Validators.required],
      name: [path.name, Validators.required]
    });
    apiPathsFormArray.push(group);
  });
}


  createApiPath(): FormGroup {
    return this.fb.group({
      id: [{value:'', disabled: true}, Validators.required],
      name: ['', Validators.required]
    });
  }

  addApiPath() {
    this.apiPaths.push(this.createApiPath());
  }

  removeApiPath(index: number) {
    if (this.apiPaths.length > 1) {
      this.apiPaths.removeAt(index);
    }
  }

//   onSubmit(): void {

//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     this.loading = true;
//     // this.form.value.sport_id = Number(this.form.value.sport_id)
//     const payload = {
//       sport_type_name : this.form.value.sport_type_name,
//       sport_sub_type: this.form.value.apiPaths
//     }
// if (this.userData) {

//   payload.sport_sub_type = payload.sport_sub_type.map((ele: any, index: any) => {
//     const data = this.userData.sport_sub_type[index]
//       if (this.userData.sport_sub_type[index]) {
//         return {
//           name: ele.name,
//           _id: data._id
//         }
//       } 
//       return {
//         name: ele.name
//       }
//     }); 
//   }
//     const request = this.userData
//       ? this.api.updateBaseSport(payload)
//       : this.api.addBaseSports(payload);

//     request.subscribe({
//       next: () => {
//         this.loading = false;
//         this.dialogRef.close(true);
//         this.toaster.success("Base Sport saved successfully");
//       },
//       error: () => {
//         this.loading = false;
//       }  // Add each path

//     });
//   }

onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;

  let payload: any;

  if (this.userData?._id) {
    // Editing case
    payload = {
      _id: this.userData._id,
      updatedData: {
        sport_type_name: this.form.getRawValue().sport_type_name, // getRawValue to include disabled fields
        sport_sub_type: this.form.getRawValue().apiPaths.map((ele: any, index: number) => {
          const existing = this.userData.sport_sub_type?.[index];
          if (existing?.id) {
            return {
              id: existing.id, 
              name: ele.name
            };
          }
          return {
            name: ele.name 
          };
        })
      }
    };
  } else {
    // Add case
    payload = {
      sport_type_name: this.form.value.sport_type_name,
      sport_sub_type: this.form.value.apiPaths.map((ele: any) => ({
        name: ele.name
      }))
    };
  }

  const request = this.userData
    ? this.api.updateBaseSport(payload)
    : this.api.addBaseSports(payload);

  request.subscribe({
    next: () => {
      this.loading = false;
      this.dialogRef.close(true);
      this.toaster.success("Base Sport saved successfully");
    },
    error: () => {
      this.loading = false;
    }
  });
}


  onCancel(): void {
    this.dialogRef.close(false);
  }

  getCompany() {
    this.api.getCompany().subscribe({
      next: (res: any) => {
        this.companies = res.data.map((ele: any) => {
          return {
            _id: ele._id,
            name: ele.name
          }
        })
      }
    })
  }
}
