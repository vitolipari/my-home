import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {Auth} from '../../services/auth';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h1>Conferma account</h1>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <input type="email" formControlName="email" placeholder="Email" />
      <input type="text" formControlName="code" placeholder="Codice di conferma" />

      <button type="submit" [disabled]="loading()">Conferma</button>
    </form>

    <p *ngIf="message()">{{ message() }}</p>

    <a routerLink="/access/sign-in">Torna al login</a>
  `
})
export class ConfirmPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly message = signal('');

  readonly form = this.fb.nonNullable.group({
    email: [this.route.snapshot.queryParamMap.get('email') ?? '', [Validators.required, Validators.email]],
    code: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.authService.confirm(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/access/sign-in'], {
          queryParams: { confirmed: 'true' }
        });
      },
      error: () => {
        this.loading.set(false);
        this.message.set('Conferma non riuscita.');
      }
    });
  }
}
