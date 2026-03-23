import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-access',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="access-layout">
      <router-outlet />
    </div>
  `
})
export class AccessPage {}
