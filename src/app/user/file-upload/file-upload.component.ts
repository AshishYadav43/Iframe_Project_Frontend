import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, inject, Inject, Input, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-upload',
  imports: [
    CommonModule,      // ✅ Now titlecase works

    NgIf,
    MatIconModule,
    MatDialogModule, // ✅ this covers <mat-dialog-actions>

    MatDialogModule,
    MatDialogActions,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  private api = inject(AuthService);

  fileName = '';
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isUploading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // data contains game info + uploadType
    private dialogRef: MatDialogRef<FileUploadComponent>,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    console.log(this.data);

    if (this.data?.existingImage) {
      this.previewUrl = this.data.existingImage;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.previewUrl = null;
    this.fileName = '';
    this.selectedFile = null;
    this.fileInputRef.nativeElement.value = '';
  }

  saveImage() {
    if (!this.selectedFile) {
      this.toastr.error("Please select an image");
      return;
    }

    this.isUploading = true;

    const formData = new FormData();
    // formData.append('gameId', this.data.data._id);
    // formData.append('gameImage', this.selectedFile);

    if (this.data.data.type == 1) {
      formData.append('gameId', this.data.data._id);
      formData.append('gameImage', this.selectedFile);
    }


    this.api.uploadImage(formData).subscribe({
      next: (res: any) => {
        this.isUploading = false;
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error(err);
        this.isUploading = false;
      }
    });
  }



}
