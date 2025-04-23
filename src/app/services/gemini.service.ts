import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Error al generar la respuesta:', error);
      return 'Ocurrió un error al obtener la respuesta.';
    }
  }
  
  async generateResponseWithImage(prompt: string, base64Image: string): Promise<string> {
    try {
      const result = await this.model.generateContent({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ]
      });
  
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Error al generar la respuesta con imagen:', error);
      return 'Ocurrió un error al obtener la respuesta con imagen.';
    }
  }
}