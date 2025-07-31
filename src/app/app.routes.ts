import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout/layout.component'; // make sure this is created

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
        path: 'users',
        loadComponent: () =>
          import('./user/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
