import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout/layout.component'; // make sure this is created
import { UserManagementComponent } from './user/user-management/user-management.component';
import { BaseSportManagementComponent } from './user/base-sport-management/base-sport-management.component';
import { CompanyManagementComponent } from './user/company-management/company-management.component';
import { ComptititonManagementComponent } from './user/comptititon-management/comptititon-management.component';
import { CurrencyManagementComponent } from './user/currency/currency-management.component';
import { ModuleManagementComponent } from './user/module-management/module-management.component';
import { RoleManagementComponent } from './user/role-management/role-management.component';
import { UsedSportsIdsComponent } from './user/SportsId/used-sports-ids/used-sports-ids.component';
import { ComptitionComponent } from './user/comptition/comptition/comptition.component';
import { JsonDetailsComponent } from './user/comptition/json-details/json-details.component';
import { MarketComponent } from './user/comptition/market/market.component';
import { CountryManagementComponent } from './user/country/country-management/country-management.component';
import { LoginPermissionManagementComponent } from './user/setting/login-permission-management/login-permission-management.component';
import { CasinoManagementComponent } from './user/sports/casino-management/casino-management.component';
import { SportManagementComponent } from './user/sports/sport-management/sport-management.component';
import { EventComponent } from './user/comptition/comptition/event/event.component';
import { CompitionProviderComponent } from './user/sports/sport-management/compition-provider/compition-provider.component';

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
        redirectTo: '/country-management?tab=1',
      },

          {
        path: 'provider',
        redirectTo: '/country-management?tab=0'
      },
      
      {
        path: 'currencies',
        redirectTo: '/country-management?tab=2',

      },
      {
        path: 'company',
        redirectTo: '/country-management?tab=3',
      },
      {
        path: 'sports',
        redirectTo: '/sports-management?tab=0'
      },
      {
        path: 'casino',
        redirectTo: '/sports-management?tab=1'
      },
      {
        path: 'sports-management',
        component: SportManagementComponent
      },
      {
        path: 'country-management',
        component: CountryManagementComponent
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
        path: 'comptitionprovider',
        component: ComptitionComponent
      },
      {
        path: 'loginPermission',
        component: LoginPermissionManagementComponent
      },
      {
        path: 'baseSports',
        component: BaseSportManagementComponent
      },
      {
        path: 'event',
        component: EventComponent
      },
      {
        path:'market',
        component:MarketComponent
      },
      {
        path:'details',
        component:JsonDetailsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
