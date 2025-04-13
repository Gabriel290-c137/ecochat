import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonButton, 
  IonCard, 
  IonItem, 
  IonInput, 
  IonCheckbox,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton, 
    IonCard, 
    IonItem, 
    IonInput, 
    IonCheckbox, 
    CommonModule, 
    FormsModule
  ]
})
export class LoginPage implements OnInit {

  usuario: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  iniciarSesion() {
    this.authService.login(this.usuario, this.password).subscribe({
      next: () => {
        this.router.navigate(['/menu']);
      },
      error: () => {
        alert('Usuario o contraseña incorrectos');
      }
    });
  }

  ngOnInit() {
  }
}