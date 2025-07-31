import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout/layout.component'; // make sure this is created
import { UserManagementComponent } from './user/user-management/user-management.component';
import { CountryManagementComponent } from './user/country/country-management/country-management.component';
import { CurrencyManagementComponent } from './user/currency/currency-management.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./authentication/login.page').then(m => m.LoginPage)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./user/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'users',
        component: UserManagementComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'countries',
       component: CountryManagementComponent
      },
      {
        path: 'currencies',
        component: CurrencyManagementComponent
      }

    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
