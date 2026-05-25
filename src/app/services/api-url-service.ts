import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment';
import {catchError, firstValueFrom, of, timeout} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiUrlService {

    private apiBaseUrl?: string;

    constructor(private http: HttpClient) {}

    async resolveApiBaseUrl(): Promise<string> {
        if (this.apiBaseUrl) {
            return this.apiBaseUrl;
        }

        const localUrl = environment.localApiBaseUrl;
        const remoteUrl = environment.remoteApiBaseUrl;

        const isLocalReachable = await this.ping(localUrl);

        this.apiBaseUrl = isLocalReachable ? localUrl : remoteUrl;

        return this.apiBaseUrl;
    }

    private async ping(baseUrl: string): Promise<boolean> {
        try {
            const response = await fetch(`${baseUrl}/health`, {
                method: 'GET',
                cache: 'no-store'
            });

            return response.ok;
        } catch {
            return false;
        }
    }

    reset(): void {
        this.apiBaseUrl = undefined;
    }
}
