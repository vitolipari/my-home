import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await authService.ensureUserLoaded();



  if (user) {
    return router.createUrlTree(['/startup']);
  }

  return true;
};
