import { LoggedUser } from './auth.models';

export interface RedirectConfig {
  notLogged?: string;
  forbidden?: string;
  disabled?: string;
  unconfirmedEmail?: string;
  incompleteProfile?: string;
  noSubscription?: string;
  offlineBlocked?: string;
}

export interface AccessControlData {


  requireEnabled?: boolean;
  requireConfirmedEmail?: boolean;
  requireCompletedProfile?: boolean;
  requireActiveSubscription?: boolean;

  requiredFeatureFlags?: string[];

  allowOffline?: boolean;

  customCheckKey?: string;

  redirectTo?: RedirectConfig;
}

export type AccessFailureReason =
  | 'NOT_LOGGED'
  | 'FORBIDDEN'
  | 'DISABLED'
  | 'UNCONFIRMED_EMAIL'
  | 'INCOMPLETE_PROFILE'
  | 'NO_SUBSCRIPTION'
  | 'OFFLINE_BLOCKED';

export interface AccessEvaluationResult {
  allowed: boolean;
  reason?: AccessFailureReason;
}

export type CustomAccessCheck = (user: LoggedUser, url: string) => boolean | Promise<boolean>;

