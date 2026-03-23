export interface LoggedUser {
  id: string;
  email: string;
  fullName: string;

  roles: string[];
  permissions: string[];
  featureFlags: string[];

  enabled: boolean;
  emailConfirmed: boolean;
  profileCompleted: boolean;
  subscriptionActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface ConfirmRequest {
  email: string;
  code: string;
}

export interface RouteAccessConfig {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requiredFeatureFlags?: string[];

  requireEnabled?: boolean;
  requireConfirmedEmail?: boolean;
  requireCompletedProfile?: boolean;
  requireActiveSubscription?: boolean;

  redirectTo?: {
    notLogged?: string;
    forbidden?: string;
    disabled?: string;
    unconfirmedEmail?: string;
    incompleteProfile?: string;
    noSubscription?: string;
  };
}
