import { computed, Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class DarkModeService {

    readonly themeMode = signal<ThemeMode>(this.readThemeMode());

    private readonly systemDark = signal(
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    readonly isDarkMode = computed(() => {
        const mode = this.themeMode();

        if (mode === 'system') {
            return this.systemDark();
        }

        return mode === 'dark';
    });

    private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    constructor() {
        this.mediaQuery.addEventListener('change', event => {
            this.systemDark.set(event.matches);
            this.applyTheme();
        });

        this.applyTheme();
    }

    setThemeMode(mode: ThemeMode): void {
        this.themeMode.set(mode);
        localStorage.setItem('theme', mode);
        this.applyTheme();
    }

    private applyTheme(): void {
        document.documentElement.setAttribute(
            'data-theme',
            this.isDarkMode() ? 'dark' : 'light'
        );
    }

    private readThemeMode(): ThemeMode {
        const saved = localStorage.getItem('theme');

        if (saved === 'light' || saved === 'dark' || saved === 'system') {
            return saved;
        }

        return 'system';
    }
}
