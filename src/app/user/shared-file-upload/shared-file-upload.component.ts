import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-shared-file-upload',
  imports: [
    NgIf
  ],
  templateUrl: './shared-file-upload.component.html',
  styleUrl: './shared-file-upload.component.css'
})
export class SharedFileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();

  selectedFileName: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      this.fileSelected.emit(file);
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }
}
