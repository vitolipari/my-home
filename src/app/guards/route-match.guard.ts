import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';
import { AccessControlService } from '../services/access-control.service';
import { AccessControlData } from '../models/access-control.models';

export const routeMatchGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
): Promise<boolean | UrlTree> => {
  const authService = inject<AuthService>(AuthService);
  const accessControlService = inject(AccessControlService);
  const router = inject(Router);

  const config = route.data?.['accessControl'] as AccessControlData | undefined;
  const url = '/' + segments.map(segment => segment.path).join('/');

  const user = await authService.ensureUserLoaded();

  const result = await accessControlService.evaluateAccess(user, url, config);

  if (result.allowed) {
    return true;
  }

  const redirectUrl = accessControlService.resolveRedirect(
    result.reason ?? 'FORBIDDEN',
    config
  );

  return router.createUrlTree([redirectUrl], {
    queryParams: {
      from: url,
      reason: result.reason
    }
  });
};
