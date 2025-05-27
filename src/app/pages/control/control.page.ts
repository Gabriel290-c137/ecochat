import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Solo esta línea para Ionic

import { MicrophoneService } from '../../services/microphone.service';
import { GeminiService } from '../../services/gemini.service';
import { TextToSpeechService } from '../../services/texttospeech.service';
import { ActivatedRoute } from '@angular/router';

import {
  Firestore,
  collection,
  doc,
  addDoc,
} from '@angular/fire/firestore';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule 
  ]
})
export class ControlPage {
  
  estaEscuchando: boolean = false;
  cargando: boolean = false;
  private route = inject(ActivatedRoute);

  uid: string = '';
  nombreColeccionConversaciones: string = '';

  private firestore = inject(Firestore);
  private auth = inject(AuthService);
  private router = inject(Router);

  private mic = inject(MicrophoneService);
  private gemini = inject(GeminiService);
  private tts = inject(TextToSpeechService);

  constructor() {
    const uid = this.auth.getUID();
    if (uid) {
        this.uid = uid;

        this.route.queryParams.subscribe(params => {
            this.nombreColeccionConversaciones = params['coleccion'] || 'conversaciones';
            console.log('Usando colección:', this.nombreColeccionConversaciones);
        });

    } else {
        console.warn('UID no disponible');
    }
  }

  iniciarConversacion() {

    this.estaEscuchando = true;
    this.mic.startListening(async (texto) => {

      this.cargando = true;

      const preguntaActual = texto;
      const fechaActual = new Date();

      const respuestaActual = await this.gemini.generateResponse(texto);

      const fechaRespuesta = new Date();

      await this.tts.speak(respuestaActual);
      await this.guardarMensajeEnFirestore(preguntaActual, respuestaActual, fechaActual, fechaRespuesta);

      this.cargando = false;
    });
  }

  detenerConversacion() {
    this.estaEscuchando = false;
    this.mic.stopListening();
    this.tts.stop();
  }

  async guardarMensajeEnFirestore(
    preguntaActual: string,
    respuestaActual: string,
    fechaActual: Date,
    fechaRespuesta: Date
  ) {
    const userDocRef = doc(this.firestore, `usuarios/${this.uid}`);
    const conversacionesRef = collection(userDocRef, this.nombreColeccionConversaciones);

    await addDoc(conversacionesRef, {
      timestamp: fechaActual,
      mensajes: [
        { from: 'user', text: preguntaActual, date: fechaActual },
        { from: 'assistant', text: respuestaActual, date: fechaRespuesta }
      ]
    });
  }

  irAMenu() {
    this.router.navigate(['/menu'], {
      queryParams: { coleccion: this.nombreColeccionConversaciones }
    });
  }
}
