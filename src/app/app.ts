import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SwUpdateService} from './services/sw-update';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class App {
  protected readonly title = signal('my-home');


  private readonly swUpdateService = inject<SwUpdateService>(SwUpdateService);

  constructor() {
    this.swUpdateService.init();
  }
}
