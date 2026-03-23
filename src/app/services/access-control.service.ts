import { Injectable } from '@angular/core';
import {
  AccessControlData,
  AccessEvaluationResult,
  CustomAccessCheck
} from '../models/access-control.models';
import { LoggedUser } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  private readonly customChecks: Record<string, CustomAccessCheck> = {
    ONLY_OWN_PROFILE: (user, url) => {
      const urlParts = url.split('/');
      const targetUserId = urlParts[urlParts.length - 1];
      return user.id === targetUserId || user.roles.includes('ADMIN');
    },

    ADMIN_OR_MANAGER: (user) => {
      return user.roles.includes('ADMIN') || user.roles.includes('MANAGER');
    }
  };

  async evaluateAccess(
    user: LoggedUser | null,
    url: string,
    config?: AccessControlData
  ): Promise<AccessEvaluationResult> {
    if (!user) {
      return {
        allowed: false,
        reason: 'NOT_LOGGED'
      };
    }

    if (!config) {
      return { allowed: true };
    }

    if (config.allowOffline === false && !navigator.onLine) {
      return {
        allowed: false,
        reason: 'OFFLINE_BLOCKED'
      };
    }

    if (config.requireEnabled && !user.enabled) {
      return {
        allowed: false,
        reason: 'DISABLED'
      };
    }

    if (config.requireConfirmedEmail && !user.emailConfirmed) {
      return {
        allowed: false,
        reason: 'UNCONFIRMED_EMAIL'
      };
    }

    if (config.requireCompletedProfile && !user.profileCompleted) {
      return {
        allowed: false,
        reason: 'INCOMPLETE_PROFILE'
      };
    }

    if (config.requireActiveSubscription && !user.subscriptionActive) {
      return {
        allowed: false,
        reason: 'NO_SUBSCRIPTION'
      };
    }

    if (config.rolesAny?.length) {
      const hasAnyRole = config.rolesAny.some(role => user.roles.includes(role));
      if (!hasAnyRole) {
        return {
          allowed: false,
          reason: 'FORBIDDEN'
        };
      }
    }

    if (config.rolesAll?.length) {
      const hasAllRoles = config.rolesAll.every(role => user.roles.includes(role));
      if (!hasAllRoles) {
        return {
          allowed: false,
          reason: 'FORBIDDEN'
        };
      }
    }

    if (config.permissionsAny?.length) {
      const hasAnyPermission = config.permissionsAny.some(permission =>
        user.permissions.includes(permission)
      );

      if (!hasAnyPermission) {
        return {
          allowed: false,
          reason: 'FORBIDDEN'
        };
      }
    }

    if (config.permissionsAll?.length) {
      const hasAllPermissions = config.permissionsAll.every(permission =>
        user.permissions.includes(permission)
      );

      if (!hasAllPermissions) {
        return {
          allowed: false,
          reason: 'FORBIDDEN'
        };
      }
    }

    if (config.requiredFeatureFlags?.length) {
      const hasAllFlags = config.requiredFeatureFlags.every(flag =>
        user.featureFlags.includes(flag)
      );

      if (!hasAllFlags) {
        return {
          allowed: false,
          reason: 'FORBIDDEN'
        };
      }
    }

    if (config.customCheckKey) {
      const customCheck = this.customChecks[config.customCheckKey];

      if (!customCheck) {
        return {
          allowed: false,
          reason: 'FORBIDDEN'
        };
      }

      const customAllowed = await customCheck(user, url);

      if (!customAllowed) {
        return {
          allowed: false,
          reason: 'FORBIDDEN'
        };
      }
    }

    return { allowed: true };
  }

  resolveRedirect(reason: string, config?: AccessControlData): string {
    const redirect = config?.redirectTo;

    switch (reason) {
      case 'NOT_LOGGED':
        return redirect?.notLogged ?? '/access/sign-in';

      case 'DISABLED':
        return redirect?.disabled ?? '/account-disabled';

      case 'UNCONFIRMED_EMAIL':
        return redirect?.unconfirmedEmail ?? '/access/confirm';

      case 'INCOMPLETE_PROFILE':
        return redirect?.incompleteProfile ?? '/profile/complete';

      case 'NO_SUBSCRIPTION':
        return redirect?.noSubscription ?? '/subscription/upgrade';

      case 'OFFLINE_BLOCKED':
        return redirect?.offlineBlocked ?? '/offline-blocked';

      case 'FORBIDDEN':
      default:
        return redirect?.forbidden ?? '/unauthorized';
    }
  }
}
