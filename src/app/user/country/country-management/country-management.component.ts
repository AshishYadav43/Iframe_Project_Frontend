import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-country-management',
  imports: [CommonModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule],
  templateUrl: './country-management.component.html',
  styleUrl: './country-management.component.css'
})
export class CountryManagementComponent {

  countries = [
    { name: 'Lanka', id: '123', code: 'LKA', symbol: '$', status: 'Active' },
    { name: 'Nepal', id: 'NPL', code: 'NPL', symbol: '$', status: 'Active' },
    { name: 'India', id: 'IND', code: 'IND', symbol: '$', status: 'Active' }
  ];

  timezones = ['Asia/Kolkata', 'Asia/Kathmandu', 'Asia/Colombo'];
  currencies = ['INR', 'NPR', 'USD'];

  newCountry = {
    name: '',
    id: '',
    code: '',
    region: '',
    currency: '',
    timezone: ''
  };

  showForm = false;

  saveCountry() {
    this.countries.push({ ...this.newCountry, symbol: '$', status: 'Active' });
    this.newCountry = { name: '', id: '', code: '', region: '', currency: '', timezone: '' };
    this.showForm = false;
  }

  cancel() {
    this.showForm = false;
  }
}
