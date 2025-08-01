import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout/layout.component'; // make sure this is created
import { UserManagementComponent } from './user/user-management/user-management.component';
import { CompanyManagementComponent } from './user/company-management/company-management.component';
import { ComptititonManagementComponent } from './user/comptititon-management/comptititon-management.component';
import { CurrencyManagementComponent } from './user/currency/currency-management.component';
import { ModuleManagementComponent } from './user/module-management/module-management.component';
import { RoleManagementComponent } from './user/role-management/role-management.component';
import { CountryManagementComponent } from './user/country/country-management/country-management.component';
import { SportManagementComponent } from './user/sports/sport-management/sport-management.component';

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
      },
      {
        path: 'sports',
        component: SportManagementComponent
      },
      {
        path: 'role',
        component: RoleManagementComponent
      },
      {
        path: 'module',
        component: ModuleManagementComponent
      },
      {
        path: 'comptition',
        component: ComptititonManagementComponent
      },
      {
        path: 'company',
        component: CompanyManagementComponent
      }

    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
