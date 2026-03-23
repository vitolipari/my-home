import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ConfirmRequest,
  LoginRequest,
  LoginResponse,
  SignUpRequest
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';

  signIn(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/signin`, payload);
  }

  signUp(payload: SignUpRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/signup`, payload);
  }

  confirm(payload: ConfirmRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/confirm`, payload);
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, { email });
  }

  checkSession(token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/check-session`, { token });
  }
}
