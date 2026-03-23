import { Routes } from '@angular/router';
import {guestGuard} from './guards/guest.guard';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'access'
  },

  {
    path: 'access',
    loadComponent: () =>
      import('./pages/access/access.page').then(m => m.AccessPage),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in'
      },
      {
        path: 'sign-in',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/sign-in/signin.page').then(m => m.SignInPage)
      },
      {
        path: 'sign-up',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/sign-up/signup.page').then(m => m.SignUpPage)
      },
      {
        path: 'confirm',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/confirm-signup/confirm-signup.page').then(m => m.ConfirmPage)
      },
      {
        path: 'forgot-password',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
      }
    ]
  },

  {
    path: 'temp-link/:token',
    loadComponent: () =>
      import('./pages/tmp-sign-link/tmp-sign-link.page').then(m => m.TempLinkPage)
  },

  {
    path: 'home-empty',
    loadComponent: () =>
      import('./pages/landing-empty/landing-empty.page').then(m => m.LandingEmptyPage)
  },

  {
    path: 'startup',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/start/start.page').then(m => m.StartupPage)
  },

  {
    path: '**',
    redirectTo: 'access'
  }
];
