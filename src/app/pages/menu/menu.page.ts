import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoService } from '../../services/photo.service';
import { UploadService } from '../../services/upload.service';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini.service';
import { EcoChatService } from '../../services/ecochat.service';
import { FileUploadService } from '../../services/fileupload.service';
import { MicrophoneService } from '../../services/microphone.service';
import { MenuHistorialService } from '../../services/menuhistorial.service';
import { MensajeService } from '../../services/mensaje.service';
import { NewChatService } from '../../services/newchat.service';

import { 
  IonChip,
  IonCardHeader,
  IonCardSubtitle,
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
  create, ellipsisVertical,
  helpCircle, personCircle, search, star, camera, send, add, mic,
  filterOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonChip,
    IonCardHeader,
    IonCardSubtitle,
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
  fechaActual: Date = new Date();

  mensajes: Array<{
    from: 'user' | 'assistant',
    text: string,
    date: Date
  }> = [];

  mensajesAgrupadosPorFecha: { fecha: string, mensajes: any[] }[] = [];

  constructor(
    public photoService: PhotoService,
    private router: Router,
    private geminiService: GeminiService,
    private ecoChatService: EcoChatService,
    public uploadService: UploadService,
    public microphoneService: MicrophoneService,
    public fileUploadService: FileUploadService,
    private menuhistorialService: MenuHistorialService,
    private mensajeService: MensajeService,
    private newchatService: NewChatService
  ) {
    addIcons({
      create, ellipsisVertical, add,
      helpCircle, personCircle, search,
      star, camera, send, mic, filterOutline
    });
  }

  irHistorial() {
    this.router.navigate(['/historial']);
  }

  irControl() {
    this.router.navigate(['/control']);
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

  addFileToUpload() {
    this.fileUploadService.pickFileFromDevice();
  }

  nuevaConversacion() {
    this.newchatService.resetConversation();
    this.mensajes = [];
    this.mensajesAgrupadosPorFecha = [];
    this.pregunta = '';
    this.respuesta = '';
  }

  async obtenerRespuesta() {
    const fotoCamara = this.photoService.photos[0]?.base64 || null;
    const fotoGaleria = this.uploadService.upload[0]?.base64 || null;
    const fotoArchivo = this.fileUploadService.files[0]?.base64 || null;
    const base64 = fotoCamara || fotoGaleria || fotoArchivo;

    if (this.pregunta.trim() === '' && !base64) {
      return;
    }

    this.isLoading = true;

    const preguntaActual = this.pregunta;

    this.mensajes.push({
      from: 'user',
      text: preguntaActual,
      date: new Date()
    });
    this.mensajesAgrupadosPorFecha = this.mensajeService.agruparPorFecha(this.mensajes);

    this.pregunta = '';
    this.respuesta = '';

    try {
      if (base64) {
        // this.respuesta = await this.geminiService.generateResponseWithImage(preguntaActual, base64);
      } else {
        // this.respuesta = await this.geminiService.generateResponse(preguntaActual);
      }

      this.mensajes.push({
        from: 'assistant',
        text: this.respuesta,
        date: new Date()
      });
      this.mensajesAgrupadosPorFecha = this.mensajeService.agruparPorFecha(this.mensajes);

      this.menuhistorialService.agregarConversacion({
        pregunta: preguntaActual,
        respuesta: this.respuesta
      });

      this.menuhistorialService.cambiarMostrarLista(true);

    } finally {
      this.isLoading = false;
    }
  }

  enviar() {
    if (this.pregunta.trim() === '') {
      return;
    }

    const preguntaActual = this.pregunta;

    this.mensajes.push({
      from: 'user',
      text: preguntaActual,
      date: new Date()
    });

    this.pregunta = '';

    this.ecoChatService.enviarPregunta(preguntaActual).subscribe((res) => {
      this.respuesta = res.respuesta;

      this.mensajes.push({
        from: 'assistant',
        text: this.respuesta,
        date: new Date()
      });
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

  ngOnInit() {
    this.menuhistorialService.seleccionada$.subscribe(conv => {
      if (conv) {
        this.pregunta = conv.pregunta;
        this.respuesta = conv.respuesta;
        this.mensajesAgrupadosPorFecha = this.mensajeService.agruparPorFecha(this.mensajes);
      }
    });
  }
}