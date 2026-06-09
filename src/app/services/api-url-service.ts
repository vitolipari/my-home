import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {catchError, firstValueFrom, of, timeout} from 'rxjs';
import {environment} from '../../environments';

@Injectable({ providedIn: 'root' })
export class ApiUrlService {

    resolveApiBaseUrl(): Promise<string> {
        return Promise.resolve(environment.apiBaseUrl);
    }

}
