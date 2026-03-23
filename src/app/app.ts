import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SwUpdate} from './services/sw-update';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-home');

  private readonly swUpdateService = inject(SwUpdate);

  constructor() {
    this.swUpdateService.init();
  }
}
