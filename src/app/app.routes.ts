import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout/layout.component'; // make sure this is created
import { UserManagementComponent } from './user/user-management/user-management.component';
import { CompanyManagementComponent } from './user/company-management/company-management.component';
import { ComptititonManagementComponent } from './user/comptititon-management/comptititon-management.component';
import { CurrencyManagementComponent } from './user/currency/currency-management.component';
import { ModuleManagementComponent } from './user/module-management/module-management.component';
import { RoleManagementComponent } from './user/role-management/role-management.component';
import { CountryManagementComponent } from './user/country/country-management/country-management.component';
import { LoginPermissionManagementComponent } from './user/setting/login-permission-management/login-permission-management.component';
import { SportManagementComponent } from './user/sports/sport-management/sport-management.component';
import { UsedSportsIdsComponent } from './user/SportsId/used-sports-ids/used-sports-ids.component';
import { BaseSportManagementComponent } from './user/base-sport-management/base-sport-management.component';

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
          redirectTo: '/sports?tab=1',
      },
      {
        path: 'currencies',
          redirectTo: '/sports?tab=2',

      },
      {
        path: 'sports',
        component: SportManagementComponent
      },


      {
        path: 'usedSportsIds',
        component: UsedSportsIdsComponent
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
          redirectTo: '/sports?tab=3',
      },
      {
        path: 'loginPermission',
        component: LoginPermissionManagementComponent
      },
      {
        path: 'baseSports',
        component: BaseSportManagementComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
