import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthgoogleService } from '../../services/authgoogle.service';
import { 
  IonHeader,
  IonContent, 
  IonButton, 
  IonCard, 
  IonItem, 
  IonInput 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent, 
    IonButton, 
    IonCard, 
    IonItem, 
    IonInput, 
    CommonModule, 
    FormsModule
  ]
})

export class RegistroPage {
  email = '';
  password = '';

  constructor(private router: Router, private authService: AuthService, private authGoogleService: AuthgoogleService) {}

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