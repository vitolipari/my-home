import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Accesso non consentito</h1>
    <p>Motivo: {{ reason }}</p>
    <p>Pagina richiesta: {{ from }}</p>
    <a routerLink="/">Torna alla home</a>
  `
})
export class UnauthorizedComponent {
  private readonly route = inject(ActivatedRoute);

  readonly reason = this.route.snapshot.queryParamMap.get('reason') ?? 'UNKNOWN';
  readonly from = this.route.snapshot.queryParamMap.get('from') ?? '/';
}
