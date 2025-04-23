import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoService } from '../../services/photo.service';
import { UploadService } from '../../services/upload.service';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini.service';
import { ChatService } from '../../services/ecochat.service';
import { MicrophoneService } from '../../services/microphone.service';
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
  IonToolbar,
  IonFabList
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  create, ellipsisHorizontal, ellipsisVertical,
  helpCircle, personCircle, search, star, camera, send, add, mic
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
    IonToolbar,
    IonFabList
  ]
})

export class MenuPage implements OnInit {
  
  pregunta: string = '';
  respuesta: string = '';
  isLoading: boolean = false;

  constructor(
    public photoService: PhotoService,
    private router: Router,
    private geminiService: GeminiService,
    private chatService: ChatService,
    public uploadService: UploadService,
    public microphoneService: MicrophoneService,

  ) {
    // Registrar íconos personalizados
    addIcons({
      create, ellipsisHorizontal, ellipsisVertical, add,
      helpCircle, personCircle, search, star, camera, send, mic
    });
  }

  irHistorial() {
    this.router.navigate(['/historial']);
  }

  irHome() {
    this.router.navigate(['/home']);
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  addPhotoToUpload() {
    this.uploadService.addNewToUpload();
  }

  async obtenerRespuesta() {
    const fotoCamara = this.photoService.photos[0]?.base64 || null;
    const fotoGaleria = this.uploadService.upload[0]?.base64 || null;
    const base64 = fotoCamara || fotoGaleria;
  
    if (this.pregunta.trim() === '' && !base64) {
      return; // No enviar si no hay ni pregunta ni imagen
    }
  
    this.isLoading = true;
    this.respuesta = '';
  
    try {
      if (base64) {
        this.respuesta = await this.geminiService.generateResponseWithImage(this.pregunta, base64);
      } else {
        this.respuesta = await this.geminiService.generateResponse(this.pregunta);
      }
    } finally {
      this.isLoading = false;
    }
  }

  enviar() {
    this.chatService.enviarPregunta(this.pregunta).subscribe((res) => {
      this.respuesta = res.respuesta;
    });
  }
  
  grabarAudio() {
    if (!this.microphoneService.isRecording) {
      this.microphoneService.startListening((textoReconocido: string) => {
        this.pregunta = textoReconocido;
      });
    } else {
      this.microphoneService.stopListening();
    }
  }

  ngOnInit() {}
  
}
