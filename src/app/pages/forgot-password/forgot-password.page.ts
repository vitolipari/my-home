import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from '../../services/auth-api';
import { LoggedUser, LoginRequest } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authApi = inject(AuthApiService);

  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'logged_user';

  readonly currentUser = signal<LoggedUser | null>(this.readUserFromStorage());
  readonly isAuthenticated = computed(() => !!this.currentUser() || this.hasToken());

  async login(payload: LoginRequest): Promise<LoggedUser> {
    const response = await firstValueFrom(this.authApi.login(payload));
    this.saveToken(response.accessToken);

    const user = await this.loadCurrentUser();
    return user;
  }

  async loadCurrentUser(): Promise<LoggedUser> {
    const user = await firstValueFrom(this.authApi.me());
    this.saveLoggedUser(user);
    return user;
  }

  async ensureUserLoaded(): Promise<LoggedUser | null> {
    const current = this.currentUser();
    if (current) {
      return current;
    }

    if (!this.hasToken()) {
      return null;
    }

    try {
      return await this.loadCurrentUser();
    } catch {
      this.clearSession();
      return null;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await firstValueFrom(this.authApi.forgotPassword(email));
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.authApi.logout());
    } catch {
      // ignora eventuali errori server in logout
    } finally {
      this.clearSession();
    }
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

  saveLoggedUser(user: LoggedUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  getLoggedUser(): LoggedUser | null {
    return this.currentUser();
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  private readUserFromStorage(): LoggedUser | null {
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
}
