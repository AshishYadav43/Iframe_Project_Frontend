import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; 

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./authentication/login.page').then(m => m.LoginPage)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./user/dashboard.page').then(m => m.DashboardPage),
  },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
];
