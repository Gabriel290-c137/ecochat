import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonContent,
  IonButton,
  IonCard,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { MicrophoneService } from '../../services/microphone.service';
import { GeminiService } from '../../services/gemini.service';
import { TextToSpeechService } from '../../services/texttospeech.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonButton,
    IonCard,
    IonItem,
    IonLabel,
    CommonModule,
    FormsModule,
    IonTitle,
    IonToolbar
  ]
})
export class ControlPage implements OnInit {

  textoUsuario: string = '';
  respuestaIA: string = '';
  cargando: boolean = false;

  constructor(
    private mic: MicrophoneService,
    private gemini: GeminiService,
    private tts: TextToSpeechService
  ) {}

  ngOnInit() {}

  iniciarConversacion() {
    this.mic.startListening(async (texto) => {
      this.textoUsuario = texto;
      this.respuestaIA = '';
      this.cargando = true;

      const respuesta = await this.gemini.generateResponse(texto);
      this.respuestaIA = respuesta;
      this.cargando = false;

      await this.tts.speak(respuesta);
    });
  }

  detenerConversacion() {
    this.mic.stopListening();
    this.tts.stop();
  }
}
