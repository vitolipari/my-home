export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  valid: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export type LoginFlowResult =
  | { status: 'SUCCESS'; token: string }
  | { status: 'INVALID_CREDENTIALS' }
  | { status: 'SERVER_UNREACHABLE' };

export interface ConfirmRequest {
  email: string;
  code: string;
}
