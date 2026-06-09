import {Component, inject, Input} from '@angular/core';
import {LoggedUser} from '../../models/auth.models';
import {JsonPipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [
        JsonPipe
    ],
    templateUrl: './header.html',
    styleUrl: './header.css',
    standalone: true
})
export class Header {

    @Input() user!: LoggedUser | null;

    private router = inject(Router);


    gotoProfilePage() {
        this.router.navigate(['/profile/page']);
    }
}
