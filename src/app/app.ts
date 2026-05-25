import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SwUpdateService} from './services/sw-update';
import {DarkModeService} from './services/dark-mode-service';
import {SvgSprite} from './ui/svg-sprite/svg-sprite';
import {Header} from './components/header/header';
import {AuthService} from './services/auth';
import {LoggedUser} from './models/auth.models';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, SvgSprite, Header],
    templateUrl: `./app.html`
})
export class App {

    protected readonly title = signal('my-house-pwa');

    authService = inject(AuthService);

    private readonly swUpdateService = inject<SwUpdateService>(SwUpdateService);
    darkModeService = inject(DarkModeService);
    user: LoggedUser | null;

    // getComputedStyle(document.body).getPropertyValue("--sky-color");

    constructor() {
        this.swUpdateService.init();
        this.user = this.authService.getLoggedUser();

        // this.isDarkTheme = this.darkModeService.readIsDarkTheme();
        // this.darkModeService.setTheme(this.darkModeService.readIsDarkTheme());
        // this.darkModeService.init();

    }


}
