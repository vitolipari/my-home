import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SwUpdateService} from './services/sw-update';
import {DarkModeService} from './services/dark-mode-service';
import {SvgSprite} from './ui/svg-sprite/svg-sprite';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, SvgSprite],
    templateUrl: `./app.html`
})
export class App {

    protected readonly title = signal('my-house-pwa');


    private readonly swUpdateService = inject<SwUpdateService>(SwUpdateService);
    darkModeService = inject(DarkModeService);

    // getComputedStyle(document.body).getPropertyValue("--sky-color");

    constructor() {
        this.swUpdateService.init();

        // this.isDarkTheme = this.darkModeService.readIsDarkTheme();
        // this.darkModeService.setTheme(this.darkModeService.readIsDarkTheme());
        // this.darkModeService.init();

    }


}
