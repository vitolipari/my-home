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
  // RUOLI
  rolesAny?: string[];
  rolesAll?: string[];

  // PERMESSI
  permissionsAny?: string[];
  permissionsAll?: string[];

  // STATO UTENTE
  requireEnabled?: boolean;
  requireConfirmedEmail?: boolean;
  requireCompletedProfile?: boolean;
  requireActiveSubscription?: boolean;

  // FEATURE FLAGS
  requiredFeatureFlags?: string[];

  // OFFLINE
  allowOffline?: boolean;

  // CUSTOM CHECK
  customCheckKey?: string;

  // REDIRECT
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
