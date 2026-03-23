import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h1>Sign In</h1>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <input type="email" formControlName="email" placeholder="Email" />
      <input type="password" formControlName="password" placeholder="Password" />

      <button type="submit" [disabled]="loading()">Accedi</button>
    </form>

    <p *ngIf="errorMessage()">{{ errorMessage() }}</p>

    <a routerLink="/access/forgot-password">Password dimenticata</a>
    <br />
    <a routerLink="/access/sign-up">Registrati</a>
  `
})
export class SignInPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.signIn(this.form.getRawValue()).subscribe({
      next: (result) => {
        this.loading.set(false);

        switch (result.status) {
          case 'SUCCESS':
            void this.router.navigate(['/startup']);
            break;

          case 'INVALID_CREDENTIALS':
            this.errorMessage.set('Credenziali non valide.');
            break;

          case 'SERVER_UNREACHABLE':
            void this.router.navigate(['/home-empty']);
            break;
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Errore inatteso.');
      }
    });
  }
}
