import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-currency-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './currency-management.component.html',
  styleUrl: './currency-management.component.css'
})
export class CurrencyManagementComponent {
  searchTerm: string = '';

  currencies = [
    { name: 'N/A', code: '123', symbol: '$', country: 'Lanka', status: 'Active', conversionRate: 'N/A' },
    { name: 'NEPALI RUPEE', code: 'NPL', symbol: '₨', country: 'Nepal', status: 'Active', conversionRate: '0.0075' },
    { name: 'RUPEE', code: 'IND', symbol: '₹', country: 'India', status: 'Active', conversionRate: '0.012' }
  ];

  showForm = false;
  showLimits = false;
  currencyName = '';
  currencySymbol = '';
  conversionRate = '';
  selectedCountry = '';
  countries = [
    { name: 'India', code: 'IN' },
    { name: 'USA', code: 'US' },
    { name: 'UK', code: 'GB' }
  ];
  limits: { code: string; selected: boolean; min: number; max: number }[] = [];

  openForm() {
    this.showForm = true;
    this.limits = [];
  }

  generateLimits() {
    this.showLimits = true;
    this.limits = Array.from({ length: 100 }, (_, i) => ({
      code: `CUR${i + 1}`,
      selected: false,
      min: 0,
      max: 100
    }));
  }

  save() {
    console.log('Saving Currency:', {
      currencyName: this.currencyName,
      currencySymbol: this.currencySymbol,
      conversionRate: this.conversionRate,
      selectedCountry: this.selectedCountry,
      limits: this.limits.filter(l => l.selected)
    });
    this.cancel();
  }

  cancel() {
    this.showForm = false;
    this.currencyName = '';
    this.currencySymbol = '';
    this.conversionRate = '';
    this.selectedCountry = '';
    this.limits = [];
  }
}
