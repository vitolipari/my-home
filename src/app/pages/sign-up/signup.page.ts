import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../../services/auth';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h1>Sign Up</h1>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <input type="text" formControlName="fullName" placeholder="Nome completo" />
      <input type="email" formControlName="email" placeholder="Email" />
      <input type="password" formControlName="password" placeholder="Password" />
      <input type="password" formControlName="confirmPassword" placeholder="Conferma password" />

      <button type="submit" [disabled]="loading()">Registrati</button>
    </form>

    <p *ngIf="message()">{{ message() }}</p>

    <a routerLink="/access/sign-in">Hai già un account?</a>
  `
})
export class SignUpPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly message = signal('');

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (value.password !== value.confirmPassword) {
      this.message.set('Le password non coincidono.');
      return;
    }

    this.loading.set(true);
    this.message.set('');

    try {
      await this.authService.signUp(value);

      await this.router.navigate(['/access/confirm'], {
        queryParams: { email: value.email }
      });

    } catch {
      this.message.set('Registrazione non riuscita.');
    } finally {
      this.loading.set(false);
    }
  }
}
