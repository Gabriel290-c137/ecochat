import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

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

  private async applyTheme(theme: 'dark' | 'light'): Promise<void> {
    const isDark = theme === 'dark';

    // Aplicar clase CSS para Ionic
    document.documentElement.classList.remove('ion-palette-dark', 'ion-palette-light');
    document.documentElement.classList.add(isDark ? 'ion-palette-dark' : 'ion-palette-light');

    // Aplicar estilo a la StatusBar en plataformas nativas
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });

        await StatusBar.setBackgroundColor({
          color: isDark ? '#061e19' : '#ffffff',
        });

        await StatusBar.setStyle({
          style: isDark ? Style.Dark : Style.Light,
        });
      } catch (error) {
        console.warn('Error al aplicar configuración de StatusBar:', error);
      }
    }
  }

  setUserTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  clearUserPreference(): void {
    localStorage.removeItem(this.storageKey);
    this.applyTheme(this.getSystemTheme());
  }
}
