import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-provider-base-type',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule,MatIconModule],
  templateUrl: './view-provider-base-type.component.html',
  styleUrl: './view-provider-base-type.component.css'
})
export class ViewProviderBaseTypeComponent {

  constructor(
    public dialogRef: MatDialogRef<ViewProviderBaseTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    
  }

}
