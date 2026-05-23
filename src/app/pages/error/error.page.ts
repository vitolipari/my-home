import { Component } from '@angular/core';
import {JsonPipe} from '@angular/common';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [
        JsonPipe
    ],
    templateUrl: './error.page.html'
})
export class ErrorPage {

    errorCode?: string;
    errorMessage?: string;
    errorDetails?: any;

    constructor() {

        const nav = history.state;

        this.errorCode = nav?.code;
        this.errorMessage = nav?.message;
        this.errorDetails = nav?.details;

    }

}
