import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://127.0.0.1:5000/chat';

  constructor(private http: HttpClient) {}

  enviarPregunta(pregunta: string): Observable<any> {
    return this.http.post(this.apiUrl, { pregunta });
  }
}
