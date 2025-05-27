import { Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SpeechRecognition as CapacitorSpeechRecognition } from '@capacitor-community/speech-recognition';

@Injectable({
  providedIn: 'root'
})
export class MicrophoneService {
  private webRecognition: any;
  public isRecording = false;

  constructor(private platform: Platform, private zone: NgZone) {
    // Solo configuramos reconocimiento web si no estamos en móvil
    if (!this.platform.is('capacitor')) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.webRecognition = new SpeechRecognition();
        this.webRecognition.lang = 'es-ES';
        this.webRecognition.interimResults = false;
        this.webRecognition.maxAlternatives = 1;
      } else {
        console.warn('Este navegador no soporta SpeechRecognition.');
      }
    }
  }

  async startListening(callback: (text: string) => void) {
    if (this.platform.is('capacitor')) {
      // MÓVIL - Capacitor
      const permissions = await CapacitorSpeechRecognition.requestPermissions();
      if (permissions.speechRecognition !== 'granted') {
        console.warn('Permiso de micrófono no concedido');
        return;
      }

      this.isRecording = true;

      const result = await CapacitorSpeechRecognition.start({
        language: 'es-ES',
        maxResults: 1,
        partialResults: false,
        prompt: 'Habla ahora',
      });

      if (result && result.matches && result.matches.length > 0) {
        callback(result.matches[0]);
      }

      this.isRecording = false;
    } else {
      // WEB
      if (!this.webRecognition) {
        console.error('Reconocimiento de voz no disponible en este navegador.');
        return;
      }

      this.webRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.zone.run(() => callback(transcript));
      };

      this.webRecognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event);
      };

      this.webRecognition.onend = () => {
        this.isRecording = false;
      };

      this.isRecording = true;
      this.webRecognition.start();
    }
  }

  async stopListening() {
    if (this.platform.is('capacitor')) {
      await CapacitorSpeechRecognition.stop();
    } else if (this.webRecognition) {
      this.webRecognition.stop();
    }
    this.isRecording = false;
  }
}
