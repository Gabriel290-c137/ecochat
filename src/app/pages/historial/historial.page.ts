import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent,
  IonButton, 
  IonItem, 
  IonList, 
  IonLabel, 
  IonIcon,  
  IonHeader, 
  IonToolbar, 
  IonButtons, 
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { close} from 'ionicons/icons';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonButton, 
    IonItem, 
    IonList, 
    IonLabel, 
    IonIcon, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    CommonModule, 
    FormsModule, 
  ]
})

export class HistorialPage implements OnInit {

  constructor(
      private router: Router
      
    ) { 
      // Registrar íconos personalizados
    addIcons({
      close
    });
    }
    
    irMenu() {
      this.router.navigate(['/menu']);
    }

    irCOnfiguracion() {
      this.router.navigate(['/configuracion']);
    }

  ngOnInit() {
  }
}
