import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudOutline,
  globe,
  moon,
  mail,
  personCircle,
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { AuthgoogleService } from 'src/app/services/authgoogle.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonList,
    IonIcon,
  ],
})
export class CuentaPage implements OnInit {
  correo: string = '';
  nombre: string = '';
  temaActual: 'light' | 'dark' = 'light';

  constructor(private authService: AuthService, private authGoogle: AuthgoogleService) {
    addIcons({ cloudOutline, globe, moon, mail, personCircle });

    // Aplicar tema inicial
    this.temaActual = this.getEffectiveTheme();
    this.applyTheme(this.temaActual);

    // Escuchar cambios en preferencia de tema del SO
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.hasUserPreference()) {
        this.temaActual = e.matches ? 'dark' : 'light';
        this.applyTheme(this.temaActual);
      }
    });
  }

  ngOnInit() {
    const user = this.authService.getUsuario() || this.authGoogle.getUsuario();
    if (user) {
      this.correo = user.email || '';
      this.nombre = user.displayName || this.generarNombreDesdeCorreo(user.email || '');
    }
  }

  generarNombreDesdeCorreo(correo: string): string {
    const parteLocal = correo.split('@')[0];
    const partes = parteLocal.split('.');
    return partes.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }

  getEffectiveTheme(): 'light' | 'dark' {
    // Si hay preferencia guardada, úsala, si no usa la preferencia del SO
    const userPref = localStorage.getItem('user-theme');
    if (userPref === 'light' || userPref === 'dark') {
      return userPref;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  hasUserPreference(): boolean {
    const userPref = localStorage.getItem('user-theme');
    return userPref === 'light' || userPref === 'dark';
  }

  applyTheme(theme: 'light' | 'dark') {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    this.temaActual = theme;
  }
}
