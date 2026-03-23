import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Auth} from '../../services/auth';

@Component({
  selector: 'app-temp-link',
  standalone: true,
  template: `<p>Reindirizzamento...</p>`
})
export class TempLinkPage {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  constructor() {
    const tempToken = this.route.snapshot.paramMap.get('token');

    if (tempToken) {
      this.authService.storeTemporaryLinkContext(tempToken);
    }

    void this.router.navigate(['/access/sign-in']);
  }
}
