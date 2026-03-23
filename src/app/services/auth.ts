import {inject, Injectable, signal} from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthApi } from './auth-api';
import { LoginFlowResult, LoginRequest, SignUpRequest, ConfirmRequest } from '../models/auth.model';
import {LoggedUser} from '../guards/owner-house-path-access';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  private readonly tokenKey = 'auth_token';
  private readonly temporaryLinkKey = 'temporary_link_context';
  private readonly userKey = 'logged_user';

  readonly authenticated = signal<boolean>(this.hasToken());

  signIn(payload: LoginRequest): Observable<LoginFlowResult> {
    return this.authApi.signIn(payload).pipe(
      map(response => {
        if (response.valid && response.token) {
          return {
            status: 'SUCCESS',
            token: response.token
          } satisfies LoginFlowResult;
        }

        return {
          status: 'INVALID_CREDENTIALS'
        } satisfies LoginFlowResult;
      }),
      tap(result => {
        if (result.status === 'SUCCESS') {
          this.saveToken(result.token);
          this.authenticated.set(true);
        }
      }),
      catchError(() =>
        of({
          status: 'SERVER_UNREACHABLE'
        } satisfies LoginFlowResult)
      )
    );
  }

  signUp(payload: SignUpRequest): Observable<void> {
    return this.authApi.signUp(payload);
  }

  confirm(payload: ConfirmRequest): Observable<void> {
    return this.authApi.confirm(payload);
  }

  forgotPassword(email: string): Observable<void> {
    return this.authApi.forgotPassword(email);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.temporaryLinkKey);
    this.authenticated.set(false);
    void this.router.navigate(['/access/sign-in']);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  storeTemporaryLinkContext(tempToken: string): void {
    sessionStorage.setItem(this.temporaryLinkKey, tempToken);
  }

  getTemporaryLinkContext(): string | null {
    return sessionStorage.getItem(this.temporaryLinkKey);
  }

  clearTemporaryLinkContext(): void {
    sessionStorage.removeItem(this.temporaryLinkKey);
  }


  getLoggedUser(): LoggedUser | null {
    const raw = localStorage.getItem(this.userKey);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as LoggedUser;
    } catch {
      return null;
    }
  }

  saveLoggedUser(user: LoggedUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearLoggedUser(): void {
    localStorage.removeItem(this.userKey);
  }

}
