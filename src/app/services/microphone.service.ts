// src/app/services/microphone.service.ts
import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MicrophoneService {
  private recognition: any;
  public isRecording = false;

  constructor(private zone: NgZone) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'es-ES';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  startListening(callback: (text: string) => void) {
    this.isRecording = true;
    this.recognition.start();

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.zone.run(() => {
        callback(transcript);
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };
  }

  stopListening() {
    this.recognition.stop();
    this.isRecording = false;
  }
}