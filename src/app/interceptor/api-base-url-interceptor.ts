import {from, Observable, switchMap} from 'rxjs';
import {ApiUrlService} from '../services/api-url-service';
import { inject } from '@angular/core';
import {
    HttpInterceptorFn
} from '@angular/common/http';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {

    if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
        return next(req);
    }

    const apiUrlService = inject(ApiUrlService);

    return from(apiUrlService.resolveApiBaseUrl()).pipe(
        switchMap((baseUrl: string) => {
            return next(
                req.clone({
                    url: `${baseUrl}${req.url}`
                })
            );
        })
    );
};
