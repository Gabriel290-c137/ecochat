import { Component, OnInit } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle, personCircleOutline, sunny, sunnyOutline, chevronForward } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { AuthgoogleService } from 'src/app/services/authgoogle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonList,
  ],
})
export class ConfiguracionPage implements OnInit {
  correo: string = '';
  nombre: string = '';

  constructor(private authService: AuthService, private authGoogle: AuthgoogleService, private router: Router) {
    addIcons({personCircle,chevronForward,personCircleOutline,sunny,sunnyOutline});
  }

    ngOnInit() {
    // Esperamos que alguno de los dos tenga un usuario válido
    const user1 = this.authService.getUsuario();
    const user2 = this.authGoogle.getUsuario();

    const user = user1 || user2;
    if (user) {
      this.correo = user.email || '';
      this.nombre = user.displayName || this.generarNombreDesdeCorreo(user.email || '');
    }
  }

  generarNombreDesdeCorreo(correo: string): string {
    const parteLocal = correo.split('@')[0];
    const partes = parteLocal.split('.');
    return partes.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  }

  irDonaciones() {
    this.router.navigate(['/donaciones']);
  }

  irCuenta() {
    this.router.navigate(['/cuenta']);
  }

  irARInfopage() {
    this.router.navigate(['/infopage']);
  }

  irComentario() {
    this.router.navigate(['/comentarios']);
  }

  CerrarSesion() {
    this.router.navigate(['/login']);
  }

  abrirFormulario() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSerYcEJlonLqzkxFFyVUT_xU9g6U54TBHVPf-9Z6j7Ehw_YKQ/viewform?usp=header', '_blank');
  }

  abrirComentarios() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLScqL8XsDdZk56hMl6LKFjMMBJ7YecsIcQ-I4ZEW9ZA11HRjjQ/viewform?usp=header', '_blank');
  }
}

