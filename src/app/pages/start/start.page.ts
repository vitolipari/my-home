import { Component, inject } from '@angular/core';
import {Auth} from '../../services/auth';

@Component({
  selector: 'app-startup',
  standalone: true,
  template: `
    <h1>Avvio applicazione</h1>
    <p>Utente autenticato correttamente.</p>

    <button type="button" (click)="logout()">Logout</button>
  `
})
export class StartupPage {
  private readonly authService = inject(Auth);

  logout(): void {
    this.authService.logout();
  }
}
