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

import { STATIC_SPORTS, VALIDATION_PATTERNS } from '../../../../core/constant/constant';
import { AuthService } from '../../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../../core/directives/directives/pattern-restrict.directive';
import { SPORT_CATEGORIES_NAME , COMPANY_SELECTION_V1 } from '../../../../core/constant/constant';

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

  
  // Convert object to array for *ngFor
  companySelection = COMPANY_SELECTION_V1;
  companySelectionOptions = Object.entries(this.companySelection).map(([key, value]) => ({ key, value }));

  // Convert object to array for *ngFor
  sport_categories_name = SPORT_CATEGORIES_NAME;
  sportCategoriesNameArrayList = Object.entries(this.sport_categories_name).map(([key, value]) => ({ key, value }));

  apiResults: { id: number; name: string; _id: string }[] = [];
  

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
      company_selection: [null, Validators.required],
      sport_name: [this.userData?.sport_name || '', [Validators.required, Validators.minLength(3)]],
      company: [this.userData?.company || '', Validators.required],
      sport_category: [this.userData?.sport_category || '', Validators.required],
      sport_sub_type: [this.userData?.selectedSubtypes || [], Validators.required],
      sport_type: [this.userData?.sport_type || '', Validators.required],
      sport_id: [this.userData?.sport_id || '', Validators.required],
    });

    // Listen for changes to selectedCategory
    this.form.get('sport_category')!.valueChanges.subscribe(value => {
      if (value) {
        this.loadApiResults(value);
      } else {
        this.apiResults = [];
        this.form.get('sport_sub_type')?.setValue([]);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.form.value.sport_id = Number(this.form.value.sport_id)
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

  
  loadApiResults(sport_type_name: string) {    
    
    // api call to get the result
    const payload = {sport_type_name: sport_type_name}
    this.api.getBaseSportSubType(payload).subscribe({
      next: (res: any) => {
        if (res.status === 'success' && res.data.length > 0) {
          
          // Directly assign the subtypes from res.data
          // Assuming res.data is array of subtypes, e.g.:
          // [{ id: 1, name: 'subOne', ... }, { id: 2, name: 'Sub Two', ... }]          
          this.apiResults = res.data[0]?.sport_sub_type || [];

          // Reset selected items when new api results loaded
          this.form.get('sport_sub_type')?.setValue([]);
        }
        else {
          this.apiResults = [];
          this.form.get('sport_sub_type')?.setValue([]);
        }
      }
    })
  }
}

