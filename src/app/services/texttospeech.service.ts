// src/app/services/text-to-speech.service.ts
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TextToSpeech as CapacitorTTS } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  constructor(private platform: Platform) {}

  async speak(text: string) {
    if (this.platform.is('capacitor')) {
      // móvil: usa el plugin de Capacitor
      await CapacitorTTS.speak({
        text,
        lang: 'es-ES',
        // opcional: rate, pitch, volume
      });
    } else {
      // web: SpeechSynthesis API
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  }

  async stop() {
    if (this.platform.is('capacitor')) {
      await CapacitorTTS.stop();
    } else {
      window.speechSynthesis.cancel();
    }
  }
}
