import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthService } from '../services/auth';
import { PermissionService } from '../services/permission.service';
import { RouteAccessConfig } from '../models/auth.models';

export const routeAccessGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const authService = inject<AuthService>(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const config = route.data['accessControl'] as RouteAccessConfig | undefined;
  const user = await authService.ensureUserLoaded();

  if (!user) {
    return router.createUrlTree([config?.redirectTo?.notLogged ?? '/access/sign-in'], {
      queryParams: { from: state.url }
    });
  }

  if (config?.requireEnabled && !user.enabled) {
    return router.createUrlTree([config.redirectTo?.disabled ?? '/account-disabled']);
  }

  if (config?.requireConfirmedEmail && !user.emailConfirmed) {
    return router.createUrlTree([config.redirectTo?.unconfirmedEmail ?? '/access/confirm']);
  }

  if (config?.requireCompletedProfile && !user.profileCompleted) {
    return router.createUrlTree([config.redirectTo?.incompleteProfile ?? '/profile/complete']);
  }

  if (config?.requireActiveSubscription && !user.subscriptionActive) {
    return router.createUrlTree([config.redirectTo?.noSubscription ?? '/subscription/upgrade']);
  }

  if (config?.requiredRoles?.length) {
    if (!permissionService.hasAnyRole(config.requiredRoles)) {
      return router.createUrlTree([config.redirectTo?.forbidden ?? '/unauthorized']);
    }
  }

  if (config?.requiredPermissions?.length) {
    if (!permissionService.hasAnyPermission(config.requiredPermissions)) {
      return router.createUrlTree([config.redirectTo?.forbidden ?? '/unauthorized']);
    }
  }

  if (config?.requiredFeatureFlags?.length) {
    if (!permissionService.hasAnyFeatureFlag(config.requiredFeatureFlags)) {
      return router.createUrlTree([config.redirectTo?.forbidden ?? '/unauthorized']);
    }
  }

  return true;
};
