import { Routes } from '@angular/router';
import { routeAccessGuard } from './guards/route-access.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [routeAccessGuard],
    data: {
      accessControl: {
        rolesAny: ['USER', 'EDITOR', 'MANAGER', 'ADMIN'],
        requireEnabled: true,
        requireConfirmedEmail: true
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
        rolesAny: ['ADMIN'],
        requireEnabled: true,
        requireConfirmedEmail: true,
        allowOffline: false
      }
    },
    loadComponent: () =>
      import('./pages/admin/admin.page').then(m => m.AdminPage)
  },



  {
    path: 'profile/:id',
    canActivate: [routeAccessGuard],
    data: {
      accessControl: {
        customCheckKey: 'ONLY_OWN_PROFILE'
      }
    },
    loadComponent: () =>
      import('./pages/profile/profile.page').then(m => m.ProfilePage)
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
