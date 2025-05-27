import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthgoogleService } from '../../services/authgoogle.service';
import {
  IonHeader,
  IonContent, 
  IonButton, 
  IonCard, 
  IonItem, 
  IonInput,
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { Keyboard } from '@capacitor/keyboard';
import { logoGoogle, person, lockClosed, personAdd, people, key } from 'ionicons/icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonButton, 
    IonCard, 
    IonItem, 
    IonInput, 
    IonIcon,
    CommonModule, 
    FormsModule
  ]
})
export class LoginPage implements OnInit {

  usuario: string = '';
  password: string = '';
  tecladoAbierto = false;
  @ViewChild('ecoInput', { static: false }) ecoInput: any;

  constructor(private router: Router, private authService: AuthService, private authGoogleService: AuthgoogleService) {
    addIcons({logoGoogle, person, lockClosed, personAdd, people, key});

    Keyboard.addListener('keyboardWillShow', () => {
      this.tecladoAbierto = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.tecladoAbierto = false;
    });

    }

  irARegistro() {
    this.router.navigate(['/registro']);
    this.usuario = '';
    this.password = '';
  }

  iniciarSesion(event?: Event) {
    if (event) event.preventDefault();

    this.authService.login(this.usuario, this.password).subscribe({
      next: () => {
        this.router.navigate(['/menu']);
        this.usuario = '';
        this.password = '';
      },
      error: () => {
        alert('Usuario o contraseña incorrectos');
        this.usuario = '';
        this.password = '';

        // Enfoca el input después de reiniciar el modelo
        setTimeout(() => {
          if (this.ecoInput) this.ecoInput.setFocus();
        }, 100);
      }
    });
  }


    ConGoogle() {
    this.authGoogleService.signInWithGoogle()
      .then(() => {
        this.router.navigate(['/menu']);
        this.usuario = '';
        this.password = '';
      })
      .catch((err: Error) => {
        alert('Error al iniciar sesión con Google: ' + err.message);
      });
  }

  ngOnInit() {
  }
}