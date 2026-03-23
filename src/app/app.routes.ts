import { Routes } from '@angular/router';
import { routeAccessGuard } from './guards/route-access.guard';
import { guestGuard } from './guards/guest.guard';
import {SignInPage} from './pages/sign-in/signin.page';

export const routes: Routes = [
  {
    path: 'access/sign-in',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/sign-in/signin.page').then(m => m.SignInPage)
  },
  {
    path: 'dashboard',
    canActivate: [routeAccessGuard],
    data: {
      accessControl: {
        requireEnabled: true,
        requireConfirmedEmail: true,
        requiredRoles: ['USER', 'MANAGER', 'ADMIN']
      }
    },
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'admin',
    canActivate: [routeAccessGuard],
    data: {
      accessControl: {
        requireEnabled: true,
        requireConfirmedEmail: true,
        requiredRoles: ['ADMIN']
      }
    },
    loadComponent: () =>
      import('./pages/admin/admin.page').then(m => m.AdminPage)
  }
];
