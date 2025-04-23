import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  constructor(private router: Router, private authService: AuthService) {}

  registrar() {
    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => alert('Error en el registro: ' + err.message),
    });
  }
  ngOnInit() {
  }
}