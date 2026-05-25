import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth';
import {environment} from '../../environment';


function getPathname(url: string): string {
    try {
        return new URL(url).pathname;
    } catch {
        return new URL(url, window.location.origin).pathname;
    }
}

function isNoAuthPath(url: string): boolean {
    const pathname = getPathname(url);

    return environment.NO_AUTH_PATHS.some((path: string) => pathname === path);
}


export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {


    if (isNoAuthPath(req.url)) {
        return next(req);
    }

    const authService = inject<AuthService>(AuthService);
    const token = authService.getToken();

    if (!token) {
        return next(req);
    }

    const cloned = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(cloned);
};
