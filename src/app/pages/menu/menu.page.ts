import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoService } from '../../services/photo.service';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini.service';

import { 
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  create, ellipsisHorizontal, ellipsisVertical,
  helpCircle, personCircle, search, star, camera, send
} from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonFooter,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonRow,
    IonSpinner,
    IonTitle,
    IonToolbar
  ]
})

export class MenuPage implements OnInit {
  
  pregunta: string = '';
  respuesta: string = '';
  isLoading: boolean = false;
  constructor(
    public photoService: PhotoService,
    private router: Router,
    private geminiService: GeminiService
  ) {
    // Registrar íconos personalizados
    addIcons({
      create, ellipsisHorizontal, ellipsisVertical,
      helpCircle, personCircle, search, star, camera, send
    });
  }

  irHistorial() {
    this.router.navigate(['/historial']);
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  async obtenerRespuesta() {
    if (this.pregunta.trim() === '') {
      return; // No enviar si la pregunta está vacía
    }
    this.isLoading = true;
    this.respuesta = ''; // Limpiar la respuesta anterior
  
    try {
      this.respuesta = await this.geminiService.generateResponse(this.pregunta);
    } finally {
      this.isLoading = false;
    }
  }
  ngOnInit() {}
  
}
