import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader,
  IonBackButton,
  IonToolbar,
  IonButtons,
  IonContent, 
  IonButton, 
  IonCard, 
  IonItem, 
  IonInput,
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logoGoogle, person, lockClosed, personAdd, people, key } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonButtons,
    IonToolbar,
    IonBackButton,
    IonContent, 
    IonButton, 
    IonCard, 
    IonItem, 
    IonInput, 
    CommonModule,
    IonIcon,
    FormsModule
  ]
})

export class RegistroPage {
  email = '';
  password = '';
  tecladoAbierto = false;

  constructor(private router: Router, private authService: AuthService, ) 
  {addIcons({logoGoogle, person, lockClosed, personAdd, people, key})
    Keyboard.addListener('keyboardWillShow', () => {
        this.tecladoAbierto = true;
      });

      Keyboard.addListener('keyboardWillHide', () => {
        this.tecladoAbierto = false;
      });
  }

  registrar() {
    this.authService.register(this.email, this.password)
      .then((estado) => {
        if (estado === 'existente') {
          alert('Usted ya se encuentra registrado');
        } else {
          alert('Registro exitoso');
          this.router.navigate(['/login']);
        }
      })
      .catch((err: Error) => {
        alert('Error en el registro: ' + err.message);
      });
  }

  ngOnInit() {
  }
}