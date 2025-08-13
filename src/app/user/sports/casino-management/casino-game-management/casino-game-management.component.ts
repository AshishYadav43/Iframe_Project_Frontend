import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';

import { CasinoManagementComponent } from '../casino-management.component';
import { FileUploadComponent } from '../../../file-upload/file-upload.component';
import { VALIDATION_PATTERNS } from '../../../../core/constant/constant';
import { AuthService } from '../../../../core/services/auth.service';
import { PatternRestrictDirective } from '../../../../core/directives/directives/pattern-restrict.directive';

import { AddUpdateCasinoGameComponent } from './add-update-casino-game/add-update-casino-game.component';
import { BulkUploadCasinoGameComponent } from './bulk-upload-casino-game/bulk-upload-casino-game.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { ViewImageComponent } from './view-image/view-image.component';

@Component({
  selector: 'app-casino-game-management',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatOption,
    TitleCasePipe
  ],
  templateUrl: './casino-game-management.component.html',
  styleUrl: './casino-game-management.component.css'
})
export class CasinoGameManagementComponent {
  displayedColumns: string[] = ['srNo', 'providerName', 'comapanyName', 'gameName', 'gameCode', 'viewImage', 'uploadImage', 'actions'];
  dataSource = new MatTableDataSource<any>();
  showButton: boolean = true;
  public api = inject(AuthService);
  private dialog = inject(MatDialog);
  pattern = VALIDATION_PATTERNS;
  filterForm!: FormGroup;
  companyOption: any[] = [];
  casinoOption: any[] = [];
  providerOption: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {
    this.getCompany();
    this.getCasinoGame();
    this.getProviders();
    this.getCasino();
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      companies: [null],
      casinos: [null],
      providers: [null]
    });
  }

  openAddCasinoGame() {
    this.dialog.open(AddUpdateCasinoGameComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe(result => {
      if (result) this.getCasinoGame();
    });
  }

  openEditCasinoGame(data: any) {
    this.dialog.open(AddUpdateCasinoGameComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: data
    }).afterClosed().subscribe(result => {
      if (result) this.getCasinoGame();
    });
  }

  openAddBulkCasinoGame() {
    this.dialog.open(BulkUploadCasinoGameComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: null
    }).afterClosed().subscribe(result => {
      if (result) this.getCasinoGame();
    });
  }

  openUploadImage(data: any, type: any) {
    this.dialog.open(FileUploadComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: { data, type } // type pass kar diya
    }).afterClosed().subscribe(result => {
      if (result) {
        this.getCasinoGame(); // refresh table
      }
    });
  }

  openImageDialog(imageUrl: string) {
    this.dialog.open(ViewImageComponent, {
      data: { imageUrl },
      width: '80%',
      maxWidth: '600px',
      panelClass: 'image-dialog-container'
    });
  }


  getCasinoGame(payload: any = {}) {
    this.api.getCasinoGame(payload).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data.games;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  getProviders() {
    this.api.getProvider().subscribe({
      next: (res: any) => {
        this.providerOption = res.data.map((ele: any) => {
          return {
            id: ele._id,
            name: ele.name
          }
        })
      }
    })
  }

  getCasino() {
    this.api.getAllCasino().subscribe({
      next: (res: any) => {
        this.casinoOption = res.data.map((ele: any) => {
          return {
            id: ele.id,
            name: ele.casinoName
          }
        })
      }
    })
  }

  getCompany() {
    this.api.getCompany().subscribe({
      next: (res: any) => {
        this.companyOption = res.data.map((ele: any) => {
          return {
            id: ele._id,
            name: ele.name
          }
        })
      }
    })
  }

  applyFilters() {
    this.getCasinoGame(this.filterForm.value);
  }

  clearFilters() {
    this.filterForm.reset();
    this.getCasinoGame();
  }

}
