import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    ConfirmRequest,
    LoggedUser,
    LoginRequest,
    LoginResponse,
    SignUpRequest
} from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/profile';

    login(payload: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/signin`, payload);
    }

    signUp(payload: SignUpRequest): Observable<void> {
        console.log('chiamata a signup');
        return this.http.post<void>(`${this.baseUrl}/signup`, payload);
    }

    // confirm(payload: ConfirmRequest): Observable<void> {
    //     return this.http.post<void>(`${this.baseUrl}/confirm`, payload);
    // }

    forgotPassword(email: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/forgot-password`, {email});
    }

    me( accessToken: string ): Promise<Observable<{ profile: LoggedUser; accessToken: string; }>> {
        // TODO da gestire meglio

        // TODO preparazione jwt
        // const now = (new Date()).getTime();
        // let payload = {
        //     sub: userId,
        //     iat: now,
        //     exp: now + 100000
        // };
        //
        // const json = JSON.stringify(payload);
        //
        // const encodedPayload = btoa(json)
        //     .replace(/\+/g,'-')
        //     .replace(/\//g,'_')
        //     .replace(/=/g,'');
        //
        //
        // const jwtHeader =
        //     btoa( JSON.stringify({"alg": "HS256", "typ": "JWT"}) )
        //         .replace(/\+/g,'-')
        //         .replace(/\//g,'_')
        //         .replace(/=/g,'')
        // ;
        //
        // return (
        //     // 3 importa chiave HMAC
        //     crypto.subtle.importKey(
        //             'raw',
        //             new TextEncoder().encode(accessToken + '@' + now),
        //             {
        //                 name: 'HMAC',
        //                 hash: 'SHA-256'
        //             },
        //             false,
        //             ['sign']
        //         )
        //
        //         .then((signatureKey: CryptoKey) => (
        //             crypto.subtle.sign(
        //                 'HMAC',
        //                 signatureKey,
        //                 new TextEncoder().encode(jwtHeader +'.'+ encodedPayload)
        //             )
        //         ))
        //
        //         .then((signatureBuffer: ArrayBuffer) => {
        //
        //             // 5 signature in base64url
        //             const signature = btoa(
        //                 String.fromCharCode(...new Uint8Array(signatureBuffer))
        //             )
        //                 .replace(/\+/g,'-')
        //                 .replace(/\//g,'_')
        //                 .replace(/=/g,'');
        //
        //             // 6 token finale
        //
        //
        //             const jwtAccessToken: string = `${ jwtHeader }.${encodedPayload}.${signature}`;
        //
        //             return this.http.get<LoggedUser>(`${this.baseUrl}/me`, {
        //                 headers: {
        //                     authorization: `Bearer ${ jwtAccessToken }`
        //                 }
        //             });
        //
        //
        //         })
        //         .catch((e: any) => {
        //             throw (e);
        //         })
        // );


        return (
            (new Promise((onFinish, onFail) => {

                onFinish(
                    this.http.get<{ profile: LoggedUser; accessToken: string; }>(`${this.baseUrl}/me`)
                );

            }))
        );


    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/logout`, {});
    }
}
