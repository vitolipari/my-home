import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth } from '../services/auth';

export interface LoggedUser {
  id: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  enabled?: boolean;
  profileCompleted?: boolean;
}

export const ownerPathAccessGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(Auth);
  const router = inject(Router);

  const user = authService.getLoggedUser();
  const targetUrl = state.url;

  if (!user) {
    return router.createUrlTree(['/access/sign-in']);
  }

  const allowed = canUserAccessPath(user, targetUrl);

  if (allowed) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};

/**
 * Qui metterai la tua logica reale in un secondo momento.
 * Per ora c'è una base pronta da estendere.
 */
function canUserAccessPath(user: LoggedUser, targetUrl: string): boolean {
  const normalizedUrl = normalizeUrl(targetUrl);

  const guardedPathRules: Array<{
    paths: string[];
    predicate: (user: LoggedUser) => boolean;
  }> = [
    {
      paths: ['/admin', '/admin/users', '/admin/settings'],
      predicate: (currentUser) => currentUser.roles?.includes('ADMIN') === true
    },
    {
      paths: ['/profile/complete'],
      predicate: (currentUser) => currentUser.profileCompleted !== true
    },
    {
      paths: ['/premium', '/reports'],
      predicate: (currentUser) => currentUser.permissions?.includes('CAN_ACCESS_REPORTS') === true
    }
  ];

  for (const rule of guardedPathRules) {
    const matches = rule.paths.some((path) => isPathMatch(normalizedUrl, path));
    if (matches) {
      return rule.predicate(user);
    }
  }

  /**
   * Default:
   * se il path non è presente nelle regole,
   * decidi qui il comportamento di fallback.
   */
  return true;
}

function normalizeUrl(url: string): string {
  return url.split('?')[0].split('#')[0];
}

function isPathMatch(currentUrl: string, configuredPath: string): boolean {
  return currentUrl === configuredPath || currentUrl.startsWith(`${configuredPath}/`);
}
