import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-empty',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Home</h1>
    <p>Server non raggiungibile. Modalità offline o contenuti non disponibili.</p>

    <a routerLink="/access/sign-in">Riprova il login</a>
  `
})
export class LandingEmptyPage {}
