import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {LoggedUser} from '../../models/auth.models';
import {Router} from '@angular/router';

@Component({
    selector: 'mobile-menu',
    imports: [
        JsonPipe
    ],
    templateUrl: './mobile-menu.component.html',
    styleUrl: './mobile-menu.component.css',
    standalone: true
})
export class MobileMenuComponent {

    private router = inject(Router);
    @Input() user!: LoggedUser | null;


    hasPermission(permission: string) {
        return this.user?.permissions.includes( permission );
    }

    gotoPage(path: string) {

    }
}
