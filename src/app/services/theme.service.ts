import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private storageKey = 'dark-mode';

  constructor() {
    this.initializeTheme();
  }

  initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme === null) {
      // Aplica modo claro por defecto
      this.setDarkTheme(false);
      localStorage.setItem(this.storageKey, 'false');
    } else {
      this.setDarkTheme(savedTheme === 'true');
    }
  }

  toggleDarkTheme(shouldAdd: boolean): void {
    localStorage.setItem(this.storageKey, String(shouldAdd));
    this.setDarkTheme(shouldAdd);
  }

  setDarkTheme(isDark: boolean): void {
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }

  getCurrentTheme(): boolean {
    const savedTheme = localStorage.getItem(this.storageKey);
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    return false;
  }
}
