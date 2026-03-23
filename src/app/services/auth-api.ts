import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ConfirmRequest,
  LoggedUser,
  LoginRequest,
  LoginResponse,
  SignUpRequest
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';

  login(payload: LoginRequest): Observable<LoginResponse> {
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

  me(): Observable<LoggedUser> {
    return this.http.get<LoggedUser>(`${this.baseUrl}/me`);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {});
  }
}
