import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storageKey = 'user-theme';

  constructor() {
    // Aplicar el tema efectivo al inicio
    this.applyTheme(this.getEffectiveTheme());

    // Escuchar los cambios del SO SIEMPRE para actualizar si no hay preferencia del usuario
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.hasUserPreference()) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  initializeTheme(): void {
    this.applyTheme(this.getEffectiveTheme());
  }

  private hasUserPreference(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }

  private getSystemTheme(): 'dark' | 'light' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private getEffectiveTheme(): 'dark' | 'light' {
    const stored = localStorage.getItem(this.storageKey);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return this.getSystemTheme();
  }

  private applyTheme(theme: 'dark' | 'light'): void {
    document.documentElement.classList.remove('ion-palette-dark', 'ion-palette-light');
    document.documentElement.classList.add(
      theme === 'dark' ? 'ion-palette-dark' : 'ion-palette-light'
    );
  }
}
